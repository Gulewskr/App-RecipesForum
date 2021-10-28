-- Create a new table called 'RecipeTypeEnum' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('RecipeTypeEnum', 'U') IS NOT NULL
DROP TABLE RecipeTypeEnum
GO

CREATE TABLE RecipeTypeEnum
(
    RecipeTypeEnumId INT IDENTITY(1,1) NOT NULL ,
    _TEXT [CHAR](20) NOT NULL,
    PRIMARY KEY (RecipeTypeEnumId)
);
GO

INSERT INTO RecipeTypeEnum ( _TEXT )
VALUES
('snack'),
('main'),
('salad'),
('soup'),
('dessert'),
('cake')
GO