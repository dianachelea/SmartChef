IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Feedback' AND TABLE_SCHEMA = 'Licenta')
BEGIN
    CREATE TABLE [Licenta].[Feedback](
        [Feedback_id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        [Feedback_name] nvarchar(50),
		[Feedback_email] nvarchar(100),
		[Feedback_description] nvarchar(1000),
		[Feedback_title] nvarchar(100),
		[Feedback_anonymus] BIT,
		[Feedback_stars] INT,
		[Feedback_category] nvarchar(50),
		[Feedback_date] DATETIME DEFAULT GETDATE(),
		CONSTRAINT CHK_Stars CHECK (Feedback_stars >=0 ),
		CONSTRAINT CHK_Feedback_Category CHECK ([Feedback_category] IN ('Content Quality', 'User Experience', 'Technical Performance', 'Cooking Tools', 'Recipes and Feedback'))
    );
END;
