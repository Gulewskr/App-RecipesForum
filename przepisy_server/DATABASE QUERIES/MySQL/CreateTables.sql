USE db_przepisy;

DROP TABLE IF EXISTS score;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tags_connection;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS images_connection;
DROP TABLE IF EXISTS recipe;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS images;

CREATE TABLE IF NOT EXISTS images (
  id INTEGER NOT NULL PRIMARY KEY auto_increment,
  img_src varchar(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER NOT NULL PRIMARY KEY auto_increment,
  login varchar(50) NOT NULL,
  password varchar(255) NOT NULL,
  nick varchar(50) NOT NULL,
  email varchar(100) NOT NULL,
  id_profile_image int(11),
  type INTEGER NOT NULL,
  FOREIGN KEY (id_profile_image) REFERENCES images(id)
);

CREATE TABLE IF NOT EXISTS recipe (
  id INTEGER NOT NULL PRIMARY KEY auto_increment,
  id_user int(11) NOT NULL,
  id_mainimage int(11),
  name varchar(100) NOT NULL,
  text TEXT,
  type INT(1) NOT NULL,
  speed INT(1) NOT NULL,
  lvl INT(1) NOT NULL,
  FOREIGN KEY (id_user) REFERENCES accounts(id),
  FOREIGN KEY (id_mainimage) REFERENCES images(id)
);

CREATE TABLE IF NOT EXISTS images_connection (
  id INTEGER NOT NULL PRIMARY KEY auto_increment,
  id_image int(11) NOT NULL,
  id_recipe int(11) NOT NULL,
  FOREIGN KEY (id_image) REFERENCES images(id),
  FOREIGN KEY (id_recipe) REFERENCES recipe(id)
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER NOT NULL PRIMARY KEY auto_increment,
  text varchar(200) NOT NULL unique
);

CREATE TABLE IF NOT EXISTS tags_connection (
  id INTEGER NOT NULL PRIMARY KEY auto_increment,
  id_tag int(11) NOT NULL,
  id_recipe int(11) NOT NULL,
  FOREIGN KEY (id_tag) REFERENCES tags(id),
  FOREIGN KEY (id_recipe) REFERENCES recipe(id)
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER NOT NULL PRIMARY KEY auto_increment,
  id_recipe int(11) NOT NULL,
  id_user int(11) NOT NULL,
  text varchar(200) NOT NULL,
  FOREIGN KEY (id_user) REFERENCES accounts(id),
  FOREIGN KEY (id_recipe) REFERENCES recipe(id)
);

CREATE TABLE IF NOT EXISTS score (
  id INTEGER NOT NULL PRIMARY KEY auto_increment,
  id_recipe int(11) NOT NULL,
  id_user int(11) NOT NULL,
  score int(1)  NOT NULL,
  FOREIGN KEY (id_user) REFERENCES accounts(id),
  FOREIGN KEY (id_recipe) REFERENCES recipe(id)
);