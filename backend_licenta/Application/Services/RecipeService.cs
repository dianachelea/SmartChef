using Application.Interfaces;
using Domain;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class RecipeService
    {
        private readonly IRecipeRepository _recipeRepository;
        private readonly ILogger<RecipeService> _logger;

        public RecipeService(IRecipeRepository recipeRepository, ILogger<RecipeService> logger)
        {
            _recipeRepository = recipeRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<Recipe>> GetAllByUser(Guid userId)
        {
            return await _recipeRepository.GetAllByUser(userId);
        }

        public async Task<IEnumerable<Recipe>> GetFavoritesByUser(Guid userId)
        {
            return await _recipeRepository.GetFavoritesByUser(userId);
        }

        public async Task<IEnumerable<Recipe>> GetTriedByUser(Guid userId)
        {
            return await _recipeRepository.GetTriedByUser(userId);
        }

        public async Task<Recipe?> GetById(Guid id)
        {
            return await _recipeRepository.GetById(id);
        }

        public async Task AddRecipe(Recipe recipe)
        {
            try
            {
                await _recipeRepository.AddRecipe(recipe);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding recipe");
                throw;
            }
        }

        public async Task UpdateRecipe(Recipe recipe)
        {
            try
            {
                await _recipeRepository.UpdateRecipe(recipe);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating recipe");
                throw;
            }
        }

        public async Task DeleteRecipe(Guid id, Guid userId)
        {
            try
            {
                await _recipeRepository.DeleteRecipe(id, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting recipe");
                throw;
            }
        }
    }
}
