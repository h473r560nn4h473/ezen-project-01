const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const fs = require('fs');

const multer = require('multer');
const path = require("path");

// 상품 등록
router.post('/admin/add_goods', function (request, response) {
    const goods = request.body;
    console.log(goods);
    try {
        // 동일 상품 존재하는지 조회
        db.query(sql.goods_check, [goods.goods_nm], function (error, results, fields) {
            if (results.length <= 0) {
                // 이미지를 제외한 굿즈 정보 먼저 입력
                db.query(sql.goods_add, [goods.goods_nm, goods.goods_price], function (error, results, fields) {
                    if (error) {
                        console.log("goods_add 쿼리적용실패");
                        return response.status(200).json({
                            message: 'fail'
                        })
                    }
                    try {
                        const pastDir = `${__dirname}` + `../../uploads/` + goods.goods_img

                        const newDir = `${__dirname}` + `../../uploads/uploadGoods/`;
                        if (!fs.existsSync(newDir)) fs.mkdirSync(newDir);
                        
                        const extension = goods.goods_img.substring(goods.goods_img.lastIndexOf('.'))

                        // 등록 상품의 번호 불러오기
                        db.query(sql.get_goods_no, [goods.goods_nm], function (error, results, fields) {
                            const filename = results[0].goods_no
                            console.log(filename);
                            console.log(extension);
                            // 이미지 폴더 및 이름(상품번호-타입) 변경
                            // 타입 0: 메인 이미지 1: 상세 이미지
                            fs.rename(pastDir, newDir + filename + extension, (err) => {
                                if (err) {
                                    console.log("이름변경실패");
                                    throw err;
                                }
                                console.log("이름변경성공");
                            });

                            // 파일 변경 모두 성공했으면 바뀐 이름으로 DB에 입력 
                            db.query(sql.add_image, [filename + extension, filename], function (error, results, fields) {
                                if (error) {
                                    console.log("이미지db업로드실패");
                                    throw error;
                                }
                                else {
                                    console.log("이미지db업로드성공");
                                    return response.status(200).json({
                                        message: 'add_complete'
                                    })
                                }
                            })

                        })

                    }
                    catch (err) {
                        db.query(sql.delete_goods, [goods.goods_nm], function (error, results, fields) {
                            console.log(goods_nm);
                            return response.status(200).json({
                                message: 'fail'
                            })
                        })
                    }
                })

            }
            else {
                return response.status(200).json({
                    message: 'already_exist_goods'
                })
            }
        })

    } catch {
        return response.status(200).json({
            message: 'DB_error'
        })
    }
})

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            cb(null, file.originalname);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// 이미지 등록 
router.post('/admin/upload_img', upload.single('img'), (request, response) => {
    setTimeout(() => {
        return response.status(200).json({
            message: 'success'
        })
    }, 2000);
})

// 이미지 제거
router.post('/admin/delete_img', (request, response) => {

    const pastname = request.body.pastname;
    try {
        if (pastname != "" && fs.existsSync(path.normalize(`${__dirname}../../uploads/${pastname}`))) {
            fs.unlinkSync(path.normalize(`${__dirname}../../uploads/${pastname}`))
        }
    }
    catch (error) {
        console.log(error)
    }
})


// 관리자 상품 리스트 
router.get('/admin/goodslist/:sortACase/:keyword', function (request, response, next) {

    const sortACase = request.params.sortACase;
    const keyword = request.params.keyword;

    let search = '';

    if (keyword != 'none') {
        search = ' WHERE goods_nm Like "%' + keyword + '%" ';
    }

    const order = sortACaseReplace(sortACase);

    db.query(sql.goods_list + search + order, function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '상품리스트에러' });
        }
        response.json(results);
    });
});

// // 상품 수정용 정보 가져오기
// router.post('/admin/get_goods_info', function (request, response, next) {
//     const goods_no = request.body.goodsno
//     db.query(sql.get_goods_info, [goods_no], function (error, results, fields) {
//         if (error) {
//             console.error(error);
//             return response.status(500).json({ error: 'goods_info_error' })
//         }
//         response.json(results);
//     })
// })

//상품수정페이지 진입
router.post('/admin/goodsmodify', (request, response) => {
    const goodsNo = request.body.goods_no;

    db.query(sql.goods_modify_look, [goodsNo], function (error, results) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '내용로드에러' });
        }
        response.json(results);
    });
});

// 상품 수정
router.post('/admin/update_goods', function (request, response, next) {
    const goods = request.body;

    db.query(sql.update_goods, [goods.GOODS_NM, goods.GOODS_PRICE, goods.GOODS_NO], function(error, results, fields) {
        if (error) {
            console.log(error);
            return response.status(500).json({ error: 'modify_failed' })
        }
        else {
            return response.status(200).json({ message: 'modify_complete' })
        }
    })
})

// 상품 제거
router.post('/admin/delete_goods', function (request, response, next) {
    const goods_no = request.body.GOODS_NO;

    // 이미지 이름 불러오기
    db.query(sql.get_img_nm, [goods_no], function (error, results, fields) {
        if (error) {
            return response.status(500).json({ error: 'goods_error' })
        }
        else {
            try {
                const goods_img = results[0].GOODS_IMG;

                // 이미지 제거
                if (goods_img && !goods_img.includes('imgempty')) {
                    fs.unlinkSync(`${__dirname}../../uploads/uploadGoods/${goods_img}`);
                }

                // 상품 제거
                db.query(sql.delete_goods_2, [goods_no], function (error, results, fields) {
                    if (error) {
                        return response.status(500).json({ error: 'goods_error' })
                    }
                    else {
                        return response.status(200).json({
                            message: 'delete_complete'
                        })
                    }
                })
            }
            catch (error) {
                console.log("에러");
            }
        }
    })
})

// // Main_카테고리별 상품 리스트 
// router.get('/goodsCate/:category/:sortCase', function (request, response, next) {
//     const category = request.params.category;
//     const sortCase = request.params.sortCase;

//     const order = sortCaseReplace(sortCase);

//     db.query(sql.goods_catelist + order, [category], function (error, results, fields) {
//         if (error) {
//             console.error(error);
//             return response.status(500).json({ error: '상품카테고리리스트에러' });
//         }
//         response.json(results);
//     });
// });

// // Main_상품 검색 리스트
// router.get('/goodsSearch/:keyword/:sortCase', function (request, response, next) {
//     const keyword = '%' + request.params.keyword + '%';
//     const sortCase = request.params.sortCase;

//     const order = sortCaseReplace(sortCase);

//     db.query(sql.goods_searchlist + order, [keyword], function (error, results, fields) {
//         if (error) {
//             console.error(error);
//             return response.status(500).json({ error: 'search_error' });
//         }
//         response.json(results);
//     });
// });


//admin 상품목록 정렬 
function sortACaseReplace(sortACase) {
    let order = ` ORDER BY goods_no DESC`; // 최근 등록 순
    if (sortACase == 1) { // 오래된 등록 순
        order = ` ORDER BY goods_no`;
    }
    if (sortACase == 2) { // 가격 높은 순
        order = ` ORDER BY goods_price DESC`;
    }
    if (sortACase == 3) { // 가격 낮은 순
        order = ` ORDER BY goods_price`;
    }
    return order;
}

// admin 주문관리 내역
// router.get('/admin/orderM/:sortCase', function (request, response, next) {
//     const sortCase = request.params.sortCase;
//     const order = orderSort(sortCase);

//     db.query(sql.admin_orderlist + order, function (error, results, fields) {
//         if (error) {
//             console.error(error);
//             return response.status(500).json({ error: '주문관리리스트에러' });
//         }
//         response.json(results);
//     });
// });

// admin 주문상태 업데이트
// router.post('/admin/updateStatus', function (request, response, next) {
//     const orderTradeNos = request.body.orderTradeNos;
//     const status = request.body.status;

//     db.query(sql.order_status_update, [status, orderTradeNos], function (error, results, fields) {
//         if (error) {
//             console.error(error);
//             return response.status(500).json({ error: '에러' });
//         }
//         return response.status(200).json({ message: 'complete' });
//     });
// });

module.exports = router;