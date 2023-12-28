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

// connection.query(
//     "SELECT * FROM tb_user WHERE USER_ID = ?",
//     [id, pw],
//     (error, results, fields) => {
//       if (results.length > 0) {
// console.log("user");
//         res.send("user");
//       } else {
//         connection.query(
//           "SELECT * FROM tb_user, tb_doctor WHERE tb_user.USER_ID = tb_doctor.DOC_ID AND tb_user.USER_ID = ? AND tb_doctor.DOC_ID = ?",
//           [id, pw],
//           (error, results, fields) => {
//             if (results.length > 0) {
// console.log("doctor");
//               res.send("doctor");
//             } else {
// console.log("fail");
//               res.send("fail");
//             }
//           }
//         );

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

module.exports = router;