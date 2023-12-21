module.exports = {
join: `INSERT INTO TB_USER (user_id, user_pw, user_nm, user_ph, pet_no, pet_nm, pet_age, pet_sex, pet_type) VALUES (?,?,?,?,?,?,?,?,?)`,
id_check: `SELECT * FROM TB_USER WHERE user_id = ?`,  
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
reviewdoclist: `SELECT rvw_no, pet_no, doc_id, rvw_title, rvw_date FROM tb_review`,
deleteReview: `DELETE FROM tb_review WHERE rvw_no = ?`,
qnalist: `SELECT qna_no, user_no, qna_title, qna_date, qna_answer, qna_state FROM tb_qna`,
deleteQna: `DELETE FROM tb_qna WHERE qna_no = ?`,
}