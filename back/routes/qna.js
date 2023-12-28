const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');

function sortCaseReplace(sortCase) {
    let order = ` ORDER BY qna_date DESC`; // 최근 순
    if (sortCase == 1) { // 오래된 순
        order = ` ORDER BY qna_date`;
    }
    return order;
}

// 문의리스트
router.get('/admin/qnalist/:sortCase/:keyword', function (request, response, next) {

    const sortCase = request.params.sortCase;
    const keyword = request.params.keyword;
    
    let search = '';

    if (keyword != 'none') {
        search = ' WHERE USER_NM Like "%' + keyword + '%" ';
    }

    const arrange = sortCaseReplace(sortCase);

    db.query(sql.qnalist + search + arrange, function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '문의리스트에러' });
        }
        response.json(results);
    });
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