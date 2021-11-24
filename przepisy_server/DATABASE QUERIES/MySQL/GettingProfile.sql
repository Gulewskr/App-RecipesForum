SELECT accounts.*, images.img_src FROM accounts LEFT JOIN images ON images.id = accounts.id_profile_image WHERE accounts.ID = 1
/*
SELECT * FROM ACCOUNTS WHERE ID = ?
*/