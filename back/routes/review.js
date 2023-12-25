const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');

function sortNCaseReplace(sortNCase) {
    let order = ` ORDER BY rvw_date DESC`; // 최근 순
    if (sortNCase == 1) { // 오래된 순
        order = ` ORDER BY rvw_date`;
    }
    if (sortNCase == 2) { // 조회수 높은 순
        order = ` ORDER BY rvw_count DESC`;
    }
    if (sortNCase == 3) { // 조회수 낮은 순
        order = ` ORDER BY rvw_count`;
    }
    return order;
}

function sortACaseReplace(sortACase) {
    let order = ` ORDER BY rvw_date DESC`; // 최근 순
    if (sortACase == 1) { // 오래된 순
        order = ` ORDER BY rvw_date`;
    }
    return order;
}

router.get('/review/:sortNCase/:keyword', function (request, response, next) {

    const sortNCase = request.params.sortNCase;
    const keyword = request.params.keyword;
    
    let search = '';

    if (keyword != 'none') {
        search = ' WHERE doc_id Like "%' + keyword + '%" ';
    }

    const narrange = sortNCaseReplace(sortNCase);

    db.query(sql.reviewdoclist + search + narrange, function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '의사리스트에러' });
        }
        response.json(results);
    });
});

router.post('/reviewdetail', (request, response) => {
    const reviewNo = request.body.rvw_no;

    db.query(sql.reviewdetail, [reviewNo], function (error, results) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '내용로드에러' });
        }
        else {
            db.query(sql.reviewhit, [reviewNo])
        }
        response.json(results);
    });
});

router.get('/admin/reviewlist/:sortACase/:keyword', function (request, response, next) {

    const sortACase = request.params.sortACase;
    const keyword = request.params.keyword;
    
    let search = '';

    if (keyword != 'none') {
        search = ' WHERE doc_id Like "%' + keyword + '%" ';
    }

    const aarrange = sortACaseReplace(sortACase);

    db.query(sql.reviewdoclist + search + aarrange, function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '의사리스트에러' });
        }
        response.json(results);
    });
});

router.delete('/admin/reviewlist/:rvw_no', function (request, response, next) {
    const reviewNo = request.params.rvw_no;

    db.query(sql.deleteReview, [reviewNo], function (error, result, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '진료기록삭제에러' });
        }
        return response.status(200).json({ message: '진료기록삭제성공' });
    });
});

router.post('/admin/reviewdetail', (request, response) => {
    const reviewNo = request.body.rvw_no;

    db.query(sql.reviewdetail, [reviewNo], function (error, results) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '내용로드에러' });
        }
        response.json(results);
    });
});

module.exports = router;