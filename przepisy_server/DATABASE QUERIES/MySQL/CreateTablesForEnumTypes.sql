DROP TABLE IF EXISTS RecipeTypeEnum;

CREATE TABLE IF NOT EXISTS RecipeTypeEnum (
  id INT(11) NOT NULL AUTO_INCREMENT,
  type CHAR(20) NOT NULL,
  PRIMARY KEY (id)
);


INSERT INTO RecipeTypeEnum ( type )
VALUES
('snack'),
('main'),
('salad'),
('soup'),
('dessert'),
('cake')