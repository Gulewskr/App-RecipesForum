/*CREATE DATABASE DB_PRZEPISY; CHARACTER  utf8 COLLATE utf8_general_ci;
USE DB_PRZEPISY;
*/
-- Create a new table called 'ACCOUNTS' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('SchemaName.ACCOUNTS', 'U') IS NOT NULL
DROP TABLE SchemaName.ACCOUNTS
GO
-- Create the table in the specified schema
CREATE TABLE SchemaName.ACCOUNTS
(
  ID INTEGER(11) NOT NULL PRIMARY KEY, -- primary key column
  _LOGIN [VARCHAR](50) NOT NULL,
  _PASSWORD [VARCHAR](255) NOT NULL,
  NICK [VARCHAR](50) NOT NULL,
  EMAIL [VARCHAR](50) NOT NULL,
  _TYPE INTEGER(1) NOT NULL,
);
GO

/*
_type:
1 - administrator
2 - moderator
3 - użytkownik "premium"
4 - użytkownik "zwykły"
*/

-- Create a new table called 'RECIPE' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('SchemaName.RECIPE', 'U') IS NOT NULL
DROP TABLE SchemaName.RECIPE
GO
-- Create the table in the specified schema
CREATE TABLE SchemaName.RECIPE
(
  ID_RECIPE INTEGER(11) NOT NULL PRIMARY KEY, -- primary key column
  ID_USER INTEGER(11) NOT NULL FOREIGN KEY REFERENCES ACCOUNTS(ID),
  _NAME [NVARCHAR](50) NOT NULL,
  _TYPE INTEGER NOT NULL,
  _TEXT TEXT NOT NULL
);
GO

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