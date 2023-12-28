const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');

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

function sortRCaseReplace(sortRCase) {
    let order = ` ORDER BY rvw_date DESC`; // 최근 순
    if (sortRCase == 1) { // 오래된 순
        order = ` ORDER BY rvw_date`;
    }
    if (sortRCase == 2) { // 조회수 높은 순
        order = ` ORDER BY rvw_count DESC`;
    }
    if (sortRCase == 3) { // 조회수 낮은 순
        order = ` ORDER BY rvw_count`;
    }
    return order;
}

function sortQCaseReplace(sortQCase) {
    let order = ` ORDER BY qna_date DESC`; // 최근 순
    if (sortQCase == 1) { // 오래된 순
        order = ` ORDER BY qna_date`;
    }
    return order;
}

//의사 마이페이지
router.get('/mypage/:doc_id', function (request, response, next) {
    const doc_id = request.params.doc_id;

    db.query(sql.get_doc_id, [doc_id], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원에러' });
        }
        response.json(results);
    });
});

//의사 정보 수정
router.post('/mypage/update', function (request, response, next) {
    const doc = request.body;

    db.query(sql.docmypage_update, [doc.doc_pw, doc.doc_nm, doc.doc_age, doc.doc_ph, doc.doc_eml, doc.doc_bio, doc.doc_mj, doc.gender, doc.user_id], function (error, result, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'docmypage_update_error' });
        }
        return response.status(200).json({ message: 'docmypage_update' });
    });
});

//의사 정보 가져오기
router.get('/getUserData', function (request, response, next) {
    const user_id = request.query.user_id;

    db.query(sql.doc_info, [user_id], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '정보에러' });
        }
        response.json(results);
    });
});

router.get('/mypage/docreview/:docId/:sortRCase/:keyword', function (request, response, next) {

    const docId = request.params.docId;
    const sortRCase = request.params.sortRCase;
    const keyword = request.params.keyword;
    
    let search = '';

    if (keyword != 'none') {
        search = ' AND PET_NO Like "%' + keyword + '%" ';
    }

    const rarrange = sortRCaseReplace(sortRCase);

    db.query(sql.reviewdocmypagelist + search + rarrange, [docId], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '의사리스트에러' });
        }
        response.json(results);
    });
});

router.delete('/mypage/docreview/:docId/:rvw_no', function (request, response, next) {
    const docId = request.params.docId;
    const reviewNo = request.params.rvw_no;

    db.query(sql.deleteReview, [reviewNo], function (error, result, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '진료기록삭제에러' });
        }
        return response.status(200).json({ message: '진료기록삭제성공' });
    });
});

router.post('/mypage/docreview/detail', (request, response) => {
    const reviewNo = request.body.rvw_no;

    db.query(sql.reviewdocdetail, [reviewNo], function (error, results) {
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

router.get('/mypage/docqna/:docId/:sortQCase/:keyword', function (request, response, next) {

    const docId = request.params.docId;
    const sortQCase = request.params.sortQCase;
    const keyword = request.params.keyword;
    
    let search = '';

    if (keyword != 'none') {
        search = ' AND USER_NM Like "%' + keyword + '%" ';
    }

    const qarrange = sortQCaseReplace(sortQCase);

    db.query(sql.docQna + search + qarrange, [docId], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '의사리스트에러' });
        }
        response.json(results);
    });
});

router.delete('/mypage/docqna/:docId/:qna_no', function (request, response, next) {
    const docId = request.params.docId;
    const qnaNo = request.params.qna_no;

    db.query(sql.deletedocQna, [reviewNo], function (error, result, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '진료기록삭제에러' });
        }
        return response.status(200).json({ message: '진료기록삭제성공' });
    });
});

router.post('/mypage/docqna/detail', (request, response) => {
    const reviewNo = request.body.qna_no;

    db.query(sql.docQnaDetail, [reviewNo], function (error, results) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '내용로드에러' });
        }
        response.json(results);
    });
});

router.get('/mypage/docreservation/:docId/:sortCase/:keyword', function (request, response, next) {

    const docId = request.params.docId;
    const sortCase = request.params.sortCase;
    const keyword = request.params.keyword;
    
    let search = '';

    if (keyword != 'none') {
        search = ' AND u.USER_NM Like "%' + keyword + '%" ';
    }

    const arrange = sortCaseReplace(sortCase);

    db.query(sql.docreservation + search + arrange, [docId], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '목록에러' });
        }
        response.json(results);
    });
});

router.delete('/mypage/docreservation/:docId/:res_no', function (request, response, next) {
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