/*
INSERT INTO accounts (id, login, password, nick, email, type) 
VALUES (1, 'test', 'test', 'test', 'test@test.com', 1);
*/
UPDATE accounts
SET nick = 'administrator'
WHERE login = 'test'; 