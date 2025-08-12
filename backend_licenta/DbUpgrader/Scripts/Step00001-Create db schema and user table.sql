IF NOT EXISTS (SELECT * FROM master.sys.databases 
          WHERE name='Smartchef')
BEGIN
    CREATE DATABASE [Smartchef]
END

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Licenta')
BEGIN
	EXEC('CREATE SCHEMA Licenta')
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users' AND TABLE_SCHEMA = 'Licenta')
BEGIN
	CREATE TABLE [Licenta].[Users](
		[Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
		[Email]			nvarchar(50)	NOT NULL,
		[Username]			nvarchar(50)	NOT NULL,
		[Password]			nvarchar(256)	NOT NULL,
		[Country]			nvarchar(100) ,
		[IsPublic]			BIT DEFAULT 1)
END