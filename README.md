# SmartChef

## Bachelor Degree Project

A web application that integrates two YOLOv8-based ingredient recognition models, allowing users to upload photos of ingredients, which are then automatically detected and used to suggest relevant recipes via the Spoonacular API.

## Main Page

The landing page introduces SmartChef’s core features, including ingredient-based recipe search, community access, and curated recipe categories (Breakfast, Lunch, Dinner). It also highlights user testimonials and invites visitors to join the cooking community.

<img width="1369" height="3631" alt="localhost_4200_" src="https://github.com/user-attachments/assets/2c912f97-bd6a-4abd-a8e6-b92fc32a5cf0" />

## Smart Suggestions

One of SmartChef’s key features is Smart Suggestions, powered by two YOLOv8-based ingredient recognition models.
Users can upload a photo of their ingredients, and the system will automatically detect them, allowing quick recipe suggestions tailored to what’s available.

<img width="1369" height="2078" alt="localhost_4200_login (2)" src="https://github.com/user-attachments/assets/5e3b59fc-57c1-450f-88d8-eeeb73d191a6" />

## Ingredient Based

The detection results can be reviewed and edited before searching for recipes, ensuring accuracy and flexibility.

<img width="1369" height="1655" alt="localhost_4200_login (5)" src="https://github.com/user-attachments/assets/db12f115-bca5-439c-966d-7cbe00985058" />

## Confusion Matrix of the models

Below are the actual performance results of the trained models, visualized through normalized confusion matrices:

<img width="3000" height="2250" alt="confusion_matrix_normalized" src="https://github.com/user-attachments/assets/3bfd5a7c-9193-4eb9-94ee-ba7aa02d9df8" />

<img width="3000" height="2250" alt="confusion_matrix_normalized2" src="https://github.com/user-attachments/assets/1d902e4c-ad65-4036-82f2-3defd94bf10b" />

## Running Locally

1. Clone the repository
2. Install dependencies for frontend and backend
3. Prepare SQL Server database. Make sure SQL Server is running.In SSMS, connect to your instance and create the database: CREATE DATABASE SmartChef;
4. Configure database connection

   - You need to update the connection string in **two places**:

     1. `DbUpgrader/Program.cs`
     2. `backend/WebApi/appsettings.json`

   - First, generate your connection string by running this SQL command in **SSMS**:

     ```sql
     DECLARE @dbName NVARCHAR(500) = 'SmartChef';

     SELECT
         'data source=' + @@servername +
         ';initial catalog=' + @dbName +
         CASE type_desc
             WHEN 'WINDOWS_LOGIN'
                 THEN ';trusted_connection=true'
             ELSE
                 ';user id=' + suser_name() + ';password=<<>>'
         END
         + ';TrustServerCertificate=True;'
         AS ConnectionString
     FROM sys.server_principals
     WHERE name = suser_name();
     ```

   - Copy the generated string and replace the defaults in:

     - **`DbUpgrader/Program.cs`**:

       ```csharp
       var connectionString =
           args.FirstOrDefault()
           ?? "data source=YOUR_SERVER;initial catalog=SmartChef;trusted_connection=true;TrustServerCertificate=True";
       EnsureDatabase.For.SqlDatabase(connectionString);
       ```

     - **`backend/WebApi/appsettings.json`**:
       ```json
       "AllowedHosts": "*",
       "ConnectionStrings": {
         "Database": "data source=YOUR_SERVER;initial catalog=SmartChef;trusted_connection=true;TrustServerCertificate=True"
       }
       ```

   - Make sure to replace `YOUR_SERVER` and authentication details with the values from the SQL query output.

5. Download the ingredient recognition models from [this link](https://drive.google.com/drive/folders/1bfDiqQJjaYglu2pGRh4-kG-00Qw38UyF?usp=sharing)

6. Place the downloaded `.pt` model file(s) in: backend/WebApi/bin/Debug/net8.0/PythonScripts

7. Run the application

   - **Backend**:
     ```bash
     cd backend/WebApi
     dotnet run
     ```
   - **Frontend**:
     ```bash
     cd front/smartchef
     ng serve
     ```

8. Access the application
   - Open your browser and go to:
     ```
     http://localhost:4200
     ```

## Tech Stack

- **Frontend:** Angular
- **Backend:** .NET
- **Database:** SQL Server
- **Machine Learning:** YOLOv8
- **API:** Spoonacular API
