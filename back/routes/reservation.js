const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');

function sortCaseReplace(sortCase) {
    let order = ` ORDER BY res_date, res_time`; // 오래된 순
    if (sortCase == 1) { // 최근 순
        order = ` ORDER BY res_date DESC, res_time DESC`;
    }
    return order;
}

// 회원리스트
router.get('/admin/reservationlist/:sortCase/:keyword', function (request, response, next) {

    const sortCase = request.params.sortCase;
    const keyword = request.params.keyword;
    
    let search = '';

    if (keyword != 'none') {
        search = ' WHERE doc_id Like "%' + keyword + '%" ';
    }

    const arrange = sortCaseReplace(sortCase);

    db.query(sql.reservationlist + search + arrange, function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '목록에러' });
        }
        response.json(results);
    });
});

// 회원 삭제
router.delete('/admin/reservationlist/:res_no', function (request, response, next) {
    const reservationNo = request.params.res_no;

    db.query(sql.deleteReservation, [reservationNo], function (error, result, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '목록삭제에러' });
        }
        return response.status(200).json({ message: '목록삭제성공' });
    });
});

module.exports = router;