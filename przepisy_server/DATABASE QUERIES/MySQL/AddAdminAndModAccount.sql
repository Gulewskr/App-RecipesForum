USE db_przepisy;

INSERT INTO accounts (login, password, nick, email, type) SELECT 'admin', SHA2('admin', 256), 'administrator', 'administrator@przepisyRG.com', 1;
INSERT INTO accounts (login, password, nick, email, type) SELECT 'mod', SHA2('mod', 256), 'moderator', 'mod@przepisyRG.com', 2;
INSERT INTO accounts (login, password, nick, email, type) SELECT 'rafi', SHA2('rafi', 256), 'premium', 'rg@premium.com', 3;
INSERT INTO accounts (login, password, nick, email, type) SELECT 'normal', SHA2('normal', 256), 'zwykły użytkownik', 'szary@gmail.com', 4;
/*
UPDATE accounts
SET nick = 'administrator'
WHERE login = 'test'; */