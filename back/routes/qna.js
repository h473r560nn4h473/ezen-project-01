const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');

async function getQnaList(sortCaseNum, setSearchNum, keyword) {
    let search = '';

    if (keyword != 'none') {
        if (setSearchNum == 0) {
            search = ` WHERE USER_NM Like "%${keyword}%"`;
        } else if (setSearchNum == 1) {
            search = ` WHERE DOC_NM Like "%${keyword}%"`;
        }
    }

    const arrange = sortCaseReplace(sortCaseNum);

    return new Promise((resolve, reject) => {
        db.query(sql.qnalist + search + arrange, function (error, results, fields) {
            if (error) {
                console.error(error);
                reject(error);
            }
            resolve(results);
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

// 문의리스트
router.get('/admin/qnalist/:setSearchNum/:sortCase/:keyword', async function (request, response, next) {

    const sortCase = request.params.sortCase;
    const setSearchNum = request.params.setSearchNum;
    const keyword = request.params.keyword;

    const arrange = sortCaseReplace(sortCase);

    try {
        const results = await getQnaList(sortCase, setSearchNum, keyword);
        response.json(results);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: '목록에러' });
    }
});

// 회원 삭제
router.delete('/admin/qnalist/:qna_no', function (request, response, next) {
    const qnaNo = request.params.qna_no;

    db.query(sql.deleteQna, [qnaNo], function (error, result, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '문의내역삭제에러' });
        }
        return response.status(200).json({ message: '문의내역삭제성공' });
    });
});

module.exports = router;