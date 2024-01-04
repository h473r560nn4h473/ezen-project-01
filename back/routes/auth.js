const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');  


// 로그인 
router.post('/login_process', function (request, response) {
    const loginUser = request.body;

    db.query(sql.id_check, [loginUser.user_id], function (error, results, fields) {
        if (results.length <= 0) {
            return response.status(200).json({
                message: 'undefined_id'
            })
        }
        else {
            db.query(sql.login, [loginUser.user_id], function (error, results, fields) {
                const same = bcrypt.compareSync(loginUser.user_pw, results[0].user_pw);

                if (same) {
                    // ID에 저장된 pw 값과 입력한 pw값이 동일한 경우
                    db.query(sql.get_user_no, [loginUser.user_id], function (error, results, fields) {
                        return response.status(200).json({
                            message: results[0].user_no
                        })
                    })
                }
                else {
                     // 비밀번호 불일치
                     return response.status(200).json({
                         message: 'incorrect_pw'
                     })
                }
            })
        }
    })
});

//회원가입
router.post('/join_process', function (request, response) {

    const user = request.body;
    const encryptedPW = bcrypt.hashSync(user.user_pw, 10);

    db.query(sql.id_check, [user.user_id], function (error, results, fields) {
        if (results.length <= 0) {
            db.query(sql.join, [user.user_id, encryptedPW, user.user_nm, user.user_ph, user.pet_no, user.pet_nm, user.pet_age, user.pet_sex, user.pet_type], function (error, data) {
                if (error) {
                    return response.status(500).json({
                        message: 'DB_error'
                    })
                }
                return response.status(200).json({
                    message: 'join_complete'
                });
            })
        }
        else {
            return response.status(200).json({
                message: 'already_exist_id'
            })
        }
    })
});

//아이디중복확인
router.post('/idcheck', function (request, response) {
    const user = request.body;

    db.query(sql.checkDuplicate, [user.user_id], function (error, results) {
        if (error) {
            return response.status(500).json({
                message: 'DB_error'
            })
        }
        if (results.length > 0) {
            response.send('중복');
        } else {
            response.send('확인');
        }
    })
});

// 관리자 체크 
router.post('/admin_check', function (request, response) {
    const loginUser = request.body;

    db.query(sql.admin_check, [loginUser.user_no], function (error, results, fields) {
        if (results[0].user_tp == 1) {
            // 로그인한 유저의 TP가 1(관리자)인 경우
            return response.status(200).json({
                message: 'admin'
            })
        }
        else {
            return response.status(200).json({
                message: 'user'
            })
        }
    })
})

function sortCaseReplace(sortCase) {
    let order = ` ORDER BY user_no DESC`; // 최근 가입 순
    if (sortCase == 1) { // 오래된 가입 순
        order = ` ORDER BY user_no`;
    }
    return order;
}

// 회원리스트
router.get('/admin/userlist/:sortCase/:keyword', function (request, response, next) {

    const sortCase = request.params.sortCase;
    const keyword = request.params.keyword;
    let search = '';

    if (keyword != 'none') {
        search = ' AND user_id Like "%' + keyword + '%" ';
    }

    const arrange = sortCaseReplace(sortCase);

    db.query(sql.userlist + search + arrange, function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원리스트에러' });
        }
        response.json(results);
    });
});

// 회원 삭제
router.delete('/admin/userlist/:user_no', function (request, response, next) {
    const userNo = request.params.user_no;

    db.query(sql.deleteUser, [userNo], function (error, result, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원삭제에러' });
        }
        return response.status(200).json({ message: '회원삭제성공' });
    });
});

// 관리자_동물정보
router.get('/admin/getPetData/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;

    db.query(sql.pet_info, [user_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '동물정보에러' });
        }
        response.json(results);
    });
});

// 아이디 찾기
router.post('/findId', function (request, response, next) {
    const user_ph = request.body.user_ph;

    db.query(sql.id_find, [user_ph], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원 에러' });
        }

        if (results.length === 0) {
            // 휴대전화번호가 데이터베이스에 존재하지 않는 경우
            return response.status(404).json({ message: 'user_not_found' });
        }

        const user_id = results[0].user_id; // 사용자 아이디를 가져옴
        return response.status(200).json({
            message: 'user_ph',
            user_id: user_id
        });
    });
});

// 임시 비밀번호
function generateTempPassword() {
    const length = 8; // 임시 비밀번호의 길이
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let tempPassword = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        tempPassword += characters[randomIndex];
    }

    return tempPassword;
}

// 비밀번호 찾기
router.post('/findPw', function (request, response, next) {
    const user_id = request.body.user_id;
    const user_ph = request.body.user_ph;

    db.query(sql.user_check, [user_ph, user_id], async function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원 에러' });
        }

        if (results.length == 0) {
            // 휴대전화번호가 데이터베이스에 존재하지 않는 경우
            return response.status(404).json({ message: 'user_not_found' });
        }

        const user_pw = generateTempPassword(); // 임시 비밀번호 생성

        const encryptedPW = bcrypt.hashSync(user_pw, 10); // 임시 비밀번호 암호화

        // 업데이트
        db.query(sql.pass_update_tem, [encryptedPW, user_id], function (error, results, fields) {
            if (error) {
                console.error(error);
                return response.status(500).json({ error: '비번 에러' });
            }
            return response.status(200).json({
                message: user_pw
            });
        });

    });
});

module.exports = router;