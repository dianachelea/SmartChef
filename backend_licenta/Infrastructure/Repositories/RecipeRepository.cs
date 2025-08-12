using Application.Interfaces;
using Domain;
using Infrastructure.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;

namespace Infrastructure.Repositories
{
    public class RecipeRepository : IRecipeRepository
    {
        private readonly IDatabaseContext _databaseContext;

        public RecipeRepository(IDatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<IEnumerable<Recipe>> GetAllByUser(Guid userId)
        {
            var sql = "SELECT * FROM [Licenta].[UserRecipes] WHERE UserId = @UserId";
            var connection = _databaseContext.GetDbConnection();
            return await connection.QueryAsync<Recipe>(sql, new { UserId = userId });
        }

        public async Task<Recipe?> GetById(Guid id)
        {
            var sql = "SELECT * FROM [Licenta].[UserRecipes] WHERE Id = @Id";
            var connection = _databaseContext.GetDbConnection();
            return await connection.QueryFirstOrDefaultAsync<Recipe>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Recipe>> GetFavoritesByUser(Guid userId)
        {
            var sql = "SELECT * FROM [Licenta].[UserRecipes] WHERE UserId = @UserId AND IsFavorite = 1";
            var connection = _databaseContext.GetDbConnection();
            return await connection.QueryAsync<Recipe>(sql, new { UserId = userId });
        }

        public async Task<IEnumerable<Recipe>> GetTriedByUser(Guid userId)
        {
            var sql = "SELECT * FROM [Licenta].[UserRecipes] WHERE UserId = @UserId AND IsTried = 1";
            var connection = _databaseContext.GetDbConnection();
            return await connection.QueryAsync<Recipe>(sql, new { UserId = userId });
        }

        public async Task<Recipe?> GetBySpoonacularId(Guid userId, int spoonacularId)
        {
            var sql = @"SELECT * FROM [Licenta].[UserRecipes] 
                        WHERE UserId = @UserId AND SpoonacularId = @SpoonacularId";
            var connection = _databaseContext.GetDbConnection();
            return await connection.QueryFirstOrDefaultAsync<Recipe>(sql, new { UserId = userId, SpoonacularId = spoonacularId });
        }

        public async Task AddRecipe(Recipe recipe)
        {
            var sql = @"INSERT INTO [Licenta].[UserRecipes]
            (Id, UserId, Title, Image, Serving, ReadyInMinutes, CookingMinutes, PreparationMinutes, Ingredients, Calories, IsFavorite, IsTried, SpoonacularId, Instructions)
            VALUES (@Id, @UserId, @Title, @Image, @Serving, @ReadyInMinutes, @CookingMinutes, @PreparationMinutes, @Ingredients, @Calories, @IsFavorite, @IsTried, @SpoonacularId, @Instructions)";

            var connection = _databaseContext.GetDbConnection();
            await connection.ExecuteAsync(sql, recipe, _databaseContext.GetDbTransaction());
        }

        public async Task UpdateRecipe(Recipe recipe)
        {
            var sql = @"UPDATE [Licenta].[UserRecipes] SET 
                      Title = @Title, Image = @Image, Serving = @Serving, ReadyInMinutes = @ReadyInMinutes, CookingMinutes = @CookingMinutes, PreparationMinutes = @PreparationMinutes, Ingredients = @Ingredients, Calories = @Calories, IsFavorite = @IsFavorite, IsTried = @IsTried, SpoonacularId = @SpoonacularId, Instructions = @Instructions
                      WHERE Id = @Id";

            var connection = _databaseContext.GetDbConnection();
            await connection.ExecuteAsync(sql, recipe, _databaseContext.GetDbTransaction());
        }

        public async Task DeleteRecipe(Guid id, Guid userId)
        {
            var sql = "DELETE FROM [Licenta].[UserRecipes] WHERE Id = @Id AND UserId = @UserId";
            var connection = _databaseContext.GetDbConnection();
            await connection.ExecuteAsync(sql, new { Id = id, UserId = userId }, _databaseContext.GetDbTransaction());
        }
    }
}
