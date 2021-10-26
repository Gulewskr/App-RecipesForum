/*CREATE DATABASE DB_PRZEPISY; CHARACTER  utf8 COLLATE utf8_general_ci;
USE DB_PRZEPISY;
*/

DROP TABLE IF EXISTS ACCOUNTS
/*
CREATE TABLE IF NOT EXISTS ACCOUNTS (
  id INTEGER NOT NULL PRIMARY KEY,
  login varchar(50) NOT NULL,
  password varchar(255) NOT NULL,
  nick varchar(50) NOT NULL,
  email varchar(100) NOT NULL,
  type INTEGER NOT NULL
) 
/*
_type:
1 - administrator
2 - moderator
3 - użytkownik "premium"
4 - użytkownik "zwykły"
*/
/*
CREATE TABLE IF NOT EXISTS recipe (
  id_recipe int(11) NOT NULL,
  id_user int(11) NOT NULL,
  name varchar(100) NOT NULL,
  _type ENUM (snack, main, salad, soup, dessert, cake),
  text TEXT,
  PRIMARY KEY (id_recipe),
  FOREIGN KEY (id_user) REFERENCES accounts(id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS images (
  id_image int(11) NOT NULL,
  id_recipe int(11) NOT NULL,
  img_src varchar(200) NOT NULL,
  PRIMARY KEY (id_image),
  FOREIGN KEY (id_recipe) REFERENCES recipe(id_recipe)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS tags (
  id_tag int(11) NOT NULL,
  text varchar(200) NOT NULL,
  PRIMARY KEY (id_tag),
  FOREIGN KEY (id_recipe) REFERENCES recipe(id_recipe)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS tags_connection (
  id_tagconnection int(11) NOT NULL,
  id_tag int(11) NOT NULL,
  id_recipe int(11) NOT NULL,
  FOREIGN KEY (id_tag) REFERENCES tags(id_tag),
  FOREIGN KEY (id_recipe) REFERENCES recipe(id_recipe)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS comments (
  id_comment int(11) NOT NULL,
  id_recipe int(11) NOT NULL,
  id_user int(11) NOT NULL,
  text varchar(200) NOT NULL,
  FOREIGN KEY (id_user) REFERENCES accounts(id),
  FOREIGN KEY (id_recipe) REFERENCES recipe(id_recipe)
)

CREATE TABLE IF NOT EXISTS score (
  id_score int(11) NOT NULL,
  id_recipe int(11) NOT NULL,
  id_user int(11) NOT NULL,
  score int(1)  NOT NULL,
  FOREIGN KEY (id_user) REFERENCES accounts(id),
  FOREIGN KEY (id_recipe) REFERENCES recipe(id_recipe)
)


INSERT INTO accounts (id, login, password, _type, email, _type) VALUES (1, test, test, test@test.com, 1);

ALTER TABLE accounts ADD PRIMARY KEY (id);
ALTER TABLE accounts MODIFY id int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;*/