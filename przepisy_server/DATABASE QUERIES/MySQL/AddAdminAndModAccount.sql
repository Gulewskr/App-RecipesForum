USE db_przepisy;

INSERT INTO accounts (login, password, nick, email, type) 
VALUES ('admin', 'admin', 'administrator', 'administrator@przepisyRG.com', 1);
INSERT INTO accounts (login, password, nick, email, type) 
VALUES ('mod', 'mod', 'moderator', 'mod@przepisyRG.com', 2);
INSERT INTO accounts (login, password, nick, email, type) 
VALUES ('rafi', 'rafi', 'premium', 'rg@premium.com', 3);
INSERT INTO accounts (login, password, nick, email, type) 
VALUES ('normal', 'normal', 'zwykły użytkownik', 'szary@gmail.com', 4);
/*
UPDATE accounts
SET nick = 'administrator'
WHERE login = 'test'; */