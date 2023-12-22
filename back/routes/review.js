const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');

function sortCaseReplace(sortCase) {
    let order = ` ORDER BY rvw_date`; // 오래된 순
    if (sortCase == 1) { // 최근 순
        order = ` ORDER BY rvw_date DESC`;
    }
    else if (sortCase == 2) { // 조회수 낮은 순 
        order = ` ORDER BY rvw_count`;
    }
    else if (sortCase == 3) { // 조회수 높은 순 
        order = ` ORDER BY rvw_count DESC`;
    }
    return order;
}

router.get('/review/:sortCase/:keyword', function (request, response, next) {

    const sortCase = request.params.sortCase;
    const keyword = request.params.keyword;
    
    let search = '';

    if (keyword != 'none') {
        search = ' WHERE doc_id Like "%' + keyword + '%" ';
    }

    const arrange = sortCaseReplace(sortCase);

    db.query(sql.reviewdoclist + search + arrange, function (error, results, fields) {
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

router.get('/admin/reviewlist/:sortCase/:keyword', function (request, response, next) {

    const sortCase = request.params.sortCase;
    const keyword = request.params.keyword;
    
    let search = '';

    if (keyword != 'none') {
        search = ' WHERE doc_id Like "%' + keyword + '%" ';
    }

    const arrange = sortCaseReplace(sortCase);

    db.query(sql.reviewdoclist + search + arrange, function (error, results, fields) {
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

module.exports = router;