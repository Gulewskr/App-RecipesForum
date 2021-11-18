SELECT r.id AS id, r.name as name, r.text as text, r.type as type, r.speed as speed, r.lvl as lvl, ir.img_src as imageUrl, u.id as user_id, u.nick as user_name, u.type as user_type, ia.img_src as user_imageUrl
FROM recipe r LEFT JOIN accounts u ON r.id_user = u.id LEFT JOIN images ir ON r.id_mainimage = ir.id LEFT JOIN images ia ON u.id_profile_image = ia.id WHERE r.id_user = 4

/*
ALL:
SELECT r.id AS id, r.name as name, r.text as text, r.type as type, r.speed as speed, r.lvl as lvl, ir.img_src as imageUrl, u.id as user_id, u.nick as user_name, u.type as user_type, ia.img_src as user_imageUrl
FROM recipe r LEFT JOIN accounts u ON r.id_user = u.id LEFT JOIN images ir ON r.id_mainimage = ir.id LEFT JOIN images ia ON u.id_profile_image = ia.id

BY RECIPE ID:
SELECT r.id AS id, r.name as name, r.text as text, r.type as type, r.speed as speed, r.lvl as lvl, ir.img_src as imageUrl, u.id as user_id, u.nick as user_name, u.type as user_type, ia.img_src as user_imageUrl
FROM recipe r LEFT JOIN accounts u ON r.id_user = u.id LEFT JOIN images ir ON r.id_mainimage = ir.id LEFT JOIN images ia ON u.id_profile_image = ia.id WHERE r.id = ?

BY USER ID:
SELECT r.id AS id, r.name as name, r.text as text, r.type as type, r.speed as speed, r.lvl as lvl, ir.img_src as imageUrl, u.id as user_id, u.nick as user_name, u.type as user_type, ia.img_src as user_imageUrl
FROM recipe r LEFT JOIN accounts u ON r.id_user = u.id LEFT JOIN images ir ON r.id_mainimage = ir.id LEFT JOIN images ia ON u.id_profile_image = ia.id WHERE r.id_user = ?

*/