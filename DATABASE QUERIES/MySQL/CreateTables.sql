DROP TABLE IF EXISTS score;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tags_connection;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS recipe;
DROP TABLE IF EXISTS accounts;

CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER NOT NULL PRIMARY KEY,
  login varchar(50) NOT NULL,
  password varchar(255) NOT NULL,
  nick varchar(50) NOT NULL,
  email varchar(100) NOT NULL,
  type INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe (
  id_recipe int(11) NOT NULL,
  id_user int(11) NOT NULL,
  name varchar(100) NOT NULL,
  text TEXT,
  type INT(1) NOT NULL,
  PRIMARY KEY (id_recipe),
  FOREIGN KEY (id_user) REFERENCES accounts(id)
);
/*
_type:
1 - administrator
2 - moderator
3 - użytkownik "premium"
4 - użytkownik "zwykły"
*/
CREATE TABLE IF NOT EXISTS images (
  id_image int(11) NOT NULL,
  id_recipe int(11) NOT NULL,
  img_src varchar(200) NOT NULL,
  PRIMARY KEY (id_image),
  FOREIGN KEY (id_recipe) REFERENCES recipe(id_recipe)
);

CREATE TABLE IF NOT EXISTS tags (
  id_tag int(11) NOT NULL,
  text varchar(200) NOT NULL,
  PRIMARY KEY (id_tag)
);

CREATE TABLE IF NOT EXISTS tags_connection (
  id_tagconnection int(11) NOT NULL,
  id_tag int(11) NOT NULL,
  id_recipe int(11) NOT NULL,
  FOREIGN KEY (id_tag) REFERENCES tags(id_tag),
  FOREIGN KEY (id_recipe) REFERENCES recipe(id_recipe)
);

CREATE TABLE IF NOT EXISTS comments (
  id_comment int(11) NOT NULL,
  id_recipe int(11) NOT NULL,
  id_user int(11) NOT NULL,
  text varchar(200) NOT NULL,
  FOREIGN KEY (id_user) REFERENCES accounts(id),
  FOREIGN KEY (id_recipe) REFERENCES recipe(id_recipe)
);

CREATE TABLE IF NOT EXISTS score (
  id_score int(11) NOT NULL,
  id_recipe int(11) NOT NULL,
  id_user int(11) NOT NULL,
  score int(1)  NOT NULL,
  FOREIGN KEY (id_user) REFERENCES accounts(id),
  FOREIGN KEY (id_recipe) REFERENCES recipe(id_recipe)
);


/*
INSERT INTO accounts (id, login, password, _type, email, _type) VALUES (1, test, test, test@test.com, 1);

ALTER TABLE accounts ADD PRIMARY KEY (id);
ALTER TABLE accounts MODIFY id int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
*/
