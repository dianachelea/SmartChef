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
3. Start the SQL Server database
4. Run backend (`dotnet run`) and frontend (`ng serve`)

## Tech Stack
- **Frontend:** Angular
- **Backend:** .NET
- **Database:** SQL Server
- **Machine Learning:** YOLOv8
- **API:** Spoonacular API



