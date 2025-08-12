using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApiContracts;
using WebApiContracts.Mappers;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class RecipesController : ControllerBase
    {
        private readonly IRecipeRepository _recipeRepository;
        private readonly IUserRepository _userRepository;

        public RecipesController(IRecipeRepository recipeRepository, IUserRepository userRepository)
        {
            _recipeRepository = recipeRepository;
            _userRepository = userRepository;
        }
        
        [HttpGet("user")]
        [Authorize]
        public async Task<IActionResult> GetByUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = (await _userRepository.GetUserInfo(email)).FirstOrDefault();
            if (user == null) return Unauthorized();

            var recipes = await _recipeRepository.GetAllByUser(user.UserId);
            return Ok(recipes);
        }

        [HttpGet("favorites")]
        [Authorize]
        public async Task<IActionResult> GetFavorites()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = (await _userRepository.GetUserInfo(email)).FirstOrDefault();
            if (user == null) return Unauthorized();

            var recipes = await _recipeRepository.GetFavoritesByUser(user.UserId);
            return Ok(recipes);
        }

        [HttpGet("tried")]
        [Authorize]
        public async Task<IActionResult> GetTried()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = (await _userRepository.GetUserInfo(email)).FirstOrDefault();
            if (user == null) return Unauthorized();

            var recipes = await _recipeRepository.GetTriedByUser(user.UserId);
            return Ok(recipes);
        }
        [HttpGet("{userId}/{recipeId}")]
        [Authorize]
        public async Task<IActionResult> GetByUserAndRecipeId(Guid userId, Guid recipeId)
        {
            var recipe = await _recipeRepository.GetById(recipeId);
            if (recipe == null || recipe.UserId != userId)
                return Forbid();

            return Ok(recipe);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddRecipe([FromBody] UserRecipeContract contract)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = (await _userRepository.GetUserInfo(email)).FirstOrDefault();
            if (user == null) return Unauthorized();

            Recipe? existing = null;

            if (contract.SpoonacularId > 0)
            {
                existing = (await _recipeRepository.GetAllByUser(user.UserId))
                            .FirstOrDefault(r => r.SpoonacularId == contract.SpoonacularId);
            }
            else
            {
                existing = (await _recipeRepository.GetAllByUser(user.UserId))
                            .FirstOrDefault(r => r.Title == contract.Title && r.Ingredients == contract.Ingredients);
            }

            if (existing != null)
            {
                bool updated = false;

                if (contract.IsFavorite)
                {
                    if (existing.IsFavorite)
                        return BadRequest(new { message = "Recipe is already marked as favorite." });
                    existing.IsFavorite = true;
                    updated = true;
                }

                if (contract.IsTried)
                {
                    if (existing.IsTried)
                        return BadRequest(new { message = "Recipe is already marked as tried." });
                    existing.IsTried = true;
                    updated = true;
                }

                if (updated)
                {
                    await _recipeRepository.UpdateRecipe(existing);
                    return Ok(new { message = "Recipe updated." });
                }

                return BadRequest(new { message = "Nothing to update." });
            }

            var recipe = contract.MapToDomain(user.UserId);
            await _recipeRepository.AddRecipe(recipe);
            return Ok(new { message = "Recipe added." });
        }



        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateRecipe(Guid id, UserRecipeContract contract)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = (await _userRepository.GetUserInfo(email)).FirstOrDefault();
            if (user == null) return Unauthorized();

            var existing = await _recipeRepository.GetById(id);
            if (existing == null || existing.UserId != user.UserId) return Forbid();

            existing.Title = contract.Title;
            existing.Image = contract.Image;
            existing.Serving = contract.Serving;
            existing.ReadyInMinutes = contract.ReadyInMinutes;
            existing.CookingMinutes = contract.CookingMinutes;
            existing.PreparationMinutes = contract.PreparationMinutes;
            existing.Ingredients = contract.Ingredients;
            existing.Calories = (double)contract.Calories;
            existing.IsFavorite = contract.IsFavorite;
            existing.IsTried = contract.IsTried;

            await _recipeRepository.UpdateRecipe(existing);
            return Ok();
        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteRecipe(Guid id)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = (await _userRepository.GetUserInfo(email)).FirstOrDefault();
            if (user == null) return Unauthorized();

            var recipe = await _recipeRepository.GetById(id);
            if (recipe == null || recipe.UserId != user.UserId) return Forbid();

            await _recipeRepository.DeleteRecipe(id, user.UserId);
            return Ok();
        }


        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(Guid id)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = (await _userRepository.GetUserInfo(email)).FirstOrDefault();
            if (user == null) return Unauthorized();

            var recipe = await _recipeRepository.GetById(id);
            if (recipe == null || recipe.UserId != user.UserId) return Forbid();

            return Ok(recipe);
        }

        [HttpGet("{userId}")]
        [Authorize]
        public async Task<IActionResult> GetByUserId(Guid userId)
        {
            var recipes = await _recipeRepository.GetAllByUser(userId);
            return Ok(recipes);
        }

    }
}
