SELECT c.id AS id, c.text as text, c.id_user as user_id, u.nick as user_name, u.type as user_type, ia.img_src as user_imageUrl FROM comments c LEFT JOIN accounts u ON c.id_user = u.id LEFT JOIN images ia ON u.id_profile_image = ia.id WHERE c.id_recipe = 1

/*
BY RECIPE ID:
SELECT c.id AS id, c.text as text, c.id_user as user_ID, u.nick as user_name, u.type as user_type, ia.img_src as user_imageUrl
FROM comments c LEFT JOIN accounts u ON c.id_user = u.id LEFT JOIN images ia ON u.id_profile_image = ia.id WHERE c.id_recipe = ?

BY USER ID:
SELECT c.id AS id, c.text as text, c.id_user as user_ID, u.nick as user_name, u.type as user_type, ia.img_src as user_imageUrl
FROM comments c LEFT JOIN accounts u ON c.id_user = u.id LEFT JOIN images ia ON u.id_profile_image = ia.id WHERE c.id_user = ?
*/