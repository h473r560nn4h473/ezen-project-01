module.exports = {
join: `INSERT INTO TB_USER (user_id, user_pw, user_nm, user_ph, pet_no, pet_nm, pet_age, pet_sex, pet_type) VALUES (?,?,?,?,?,?,?,?,?)`,
id_check: `SELECT * FROM TB_USER WHERE user_id = ?`,
doc_id_check: `SELECT * FROM tb_user, tb_doctor WHERE tb_user.USER_ID = tb_doctor.DOC_ID AND tb_user.USER_ID = ? AND tb_doctor.DOC_ID = ?`,
get_user_no: `SELECT user_no FROM TB_USER WHERE user_id = ?`,    
login: `SELECT user_pw FROM TB_USER WHERE user_id = ?`,
admin_check: `SELECT user_tp FROM tb_user WHERE user_no = ?`,
userlist: `SELECT user_no, user_id, user_nm, user_ph, user_social_tp, pet_no, pet_nm, pet_type, pet_age, pet_sex
                FROM tb_user
                WHERE user_tp = 0`,
pet_info: `SELECT pet_no, pet_nm, pet_type, pet_age, pet_sex, pet_img
                FROM tb_user
                WHERE user_no = ?`,
deleteUser: `DELETE FROM tb_user WHERE user_no = ?`,
reviewdoclist: `SELECT r.*, d.DOC_NM FROM tb_review r INNER JOIN tb_doctor d ON r.DOC_ID = d.DOC_ID`,
deleteReview: `DELETE FROM tb_review WHERE rvw_no = ?`,
reviewdetail: `SELECT r.*, u.PET_IMG, d.DOC_NM FROM tb_review r INNER JOIN tb_user u ON r.PET_NO = u.PET_NO INNER JOIN tb_doctor d ON r.DOC_ID = d.DOC_ID WHERE r.rvw_no = ?`,
reviewhit: `UPDATE tb_review SET rvw_count = rvw_count + 1 WHERE rvw_no = ?`,
qnalist: `SELECT q.*, u.USER_NM, d.DOC_NM FROM tb_qna q LEFT JOIN tb_user u ON q.USER_NO = u.USER_NO INNER JOIN tb_doctor d ON q.DOC_ID = d.DOC_ID`,
deleteQna: `DELETE FROM tb_qna WHERE qna_no = ?`,
reservationlist: `SELECT r.*, u.USER_NM, d.DOC_NM FROM tb_reservation r INNER JOIN tb_user u ON r.PET_NO = u.PET_NO INNER JOIN tb_doctor d ON r.DOC_ID = d.DOC_ID`,
deleteReservation: `DELETE FROM tb_reservation WHERE res_no = ?`,
//SELECT * FROM tb_doctor WHERE doc_id = ?`,
doc_info: `SELECT tb_doctor.*, tb_user.USER_NO, tb_user.USER_ID, tb_user.USER_TP FROM tb_doctor JOIN tb_user ON tb_doctor.DOC_ID = tb_user.USER_ID WHERE tb_user.USER_ID = ?`,
get_doc_id: `SELECT doc_id, doc_nm, doc_age, doc_ph, doc_eml, doc_bio, doc_mj, doc_sex FROM tb_doctor WHERE doc_id = ?`,
docmypage_update: `UPDATE tb_doctor 
                    SET DOC_PW = ?, DOC_NM = ?, DOC_AGE = ?, DOC_PH = ?, DOC_EML = ?, DOC_BIO = ?, DOC_MJ = ?, DOC_SEX = ?
                    WHERE doc_id = ?`,
//doc_check: `SELECT DOC_ID FROM TB_DOCTOR WHERE DOC_ID = ?`,
doc_check: `SELECT tb_doctor.*, tb_user.USER_NO FROM tb_doctor INNER JOIN tb_user ON tb_doctor.DOC_ID = tb_user.USER_ID WHERE tb_doctor.DOC_ID = ?`,
docreservation: `SELECT * FROM tb_reservation r JOIN tb_user u ON r.PET_NO = u.PET_NO JOIN tb_doctor d ON r.DOC_ID = d.DOC_ID WHERE r.DOC_ID = ?`,
reviewdocmypagelist: `SELECT r.*, d.DOC_NM FROM tb_review r, tb_doctor d WHERE r.DOC_ID = d.DOC_ID AND r.DOC_ID = ?`,
reviewdocdetail: `SELECT r.*, u.PET_IMG, d.DOC_NM FROM tb_review r INNER JOIN tb_user u ON r.PET_NO = u.PET_NO INNER JOIN tb_doctor d ON r.DOC_ID = d.DOC_ID WHERE r.rvw_no = ?`,
docQna: `SELECT q.*, u.USER_NM, d.DOC_NM FROM tb_qna q LEFT JOIN tb_user u ON q.USER_NO = u.USER_NO INNER JOIN tb_doctor d ON q.DOC_ID = d.DOC_ID WHERE q.DOC_ID = ?`,
docQnaDetail: `SELECT q.*, u.USER_NM, d.DOC_NM FROM tb_qna q LEFT JOIN tb_user u ON q.USER_NO = u.USER_NO INNER JOIN tb_doctor d ON q.DOC_ID = d.DOC_ID WHERE q.QNA_NO = ?`,
}