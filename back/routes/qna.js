const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');

async function getQnaList(sortCaseNum, setSearchNum, keyword) {
    let search = '';

    if (keyword != 'none') {    //keyword가 빈 칸이 아닐 때
        if (setSearchNum == 0) {
            search = ` WHERE USER_NM Like "%${keyword}%"`;  //USER_NM 필드에서 keyword가 포함된 데이터를 전부 출력
        } else if (setSearchNum == 1) {
            search = ` WHERE DOC_NM Like "%${keyword}%"`;
        }
    }

    const arrange = sortCaseReplace(sortCaseNum);   //front에서 정렬 조건을 전달받음

    return new Promise((resolve, reject) => {
        db.query(sql.qnalist + search + arrange, function (error, results) {    //sql.js qnalist query문에 search query문과 sortCaseReplace query문을 순서대로 잇는다
            if (error) {
                console.error(error);
                reject(error);
            }
            resolve(results);   //Promise 객체가 성공적으로 완료되었을 때 결과값을 반환하고, 실패했을 때 오류를 반환함
        });
    });
}

function sortCaseReplace(sortCase) {
    let order = ` ORDER BY qna_date DESC`; // 최근 순
    if (sortCase == 1) { // 오래된 순
        order = ` ORDER BY qna_date`;
    }
    return order;
}

//문의내역 목록
router.get('/admin/qnalist/:setSearchNum/:sortCase/:keyword', async function (request, response) {

    const sortCase = request.params.sortCase;   //const = 대상을 변경하지 않는 상수
    const setSearchNum = request.params.setSearchNum;
    const keyword = request.params.keyword;

    try {
        const results = await getQnaList(sortCase, setSearchNum, keyword);  //front에서 조건을 전달받아 페이지를 출력
        response.json(results);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: '목록에러' });
    }
});

//문의내역 삭제
router.delete('/admin/qnalist/:qna_no', function (request, response) {
    const qnaNo = request.params.qna_no;

    db.query(sql.deleteQna, [qnaNo], function (error) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '문의내역삭제에러' });
        }
        return response.status(200).json({ message: '문의내역삭제성공' });
    });
});

module.exports = router;