const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');

async function getReservationList(sortCaseNum, setSearchNum, keyword) {
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
        db.query(sql.reservationlist + search + arrange, function (error, results, fields) {
            if (error) {
                console.error(error);
                reject(error);
            }
            resolve(results);
        });
    });
}

function sortCaseReplace(sortCase) {
    let order = ` ORDER BY res_no DESC`; // 최근 예약번호 순
    if (sortCase == 1) { // 오래된 예약번호 순
        order = ` ORDER BY res_no`;
    }
    if (sortCase == 2) { // 최근 예약일 순
        order = ` ORDER BY res_date DESC, res_time`;
    }
    if (sortCase == 3) { // 오래된 예약일 순
        order = ` ORDER BY res_date, res_time DESC`;
    }
    return order;
}

router.get('/admin/reservationlist/:setSearchNum/:sortCase/:keyword', async function (request, response, next) {

    const sortCase = request.params.sortCase;
    const setSearchNum = request.params.setSearchNum;
    const keyword = request.params.keyword;

    try {
        const results = await getReservationList(sortCase, setSearchNum, keyword);
        response.json(results);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: '목록에러' });
    }
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