IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_NAME = 'UserRecipes' AND TABLE_SCHEMA = 'Licenta'
)
BEGIN
    CREATE TABLE [Licenta].[UserRecipes] (
        [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        [UserId] UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Licenta.Users(Id),
        [Title] NVARCHAR(200) NOT NULL,
        [Image] NVARCHAR(MAX),
        [Serving] INT,
        [ReadyInMinutes] INT,
        [CookingMinutes] INT,
        [PreparationMinutes] INT,
        [Ingredients] NVARCHAR(MAX),
        [Calories] DECIMAL(6,2),
        [IsFavorite] BIT DEFAULT 0,
        [IsTried] BIT DEFAULT 0
    );
END
