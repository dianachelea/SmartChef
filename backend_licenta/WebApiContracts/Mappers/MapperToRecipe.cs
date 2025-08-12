using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApiContracts.Mappers
{
    public static class MapperToRecipe
    {
        public static Recipe MapToDomain(this UserRecipeContract contract, Guid userId)
        {
            return new Recipe
            {
                Id = contract.Id ?? Guid.NewGuid(),
                UserId = userId,
                Title = contract.Title,
                Image = contract.Image,
                Serving = contract.Serving,
                ReadyInMinutes = contract.ReadyInMinutes,
                CookingMinutes = contract.CookingMinutes,
                PreparationMinutes = contract.PreparationMinutes,
                Ingredients = contract.Ingredients,
                Calories = (double)contract.Calories,
                IsFavorite = contract.IsFavorite,
                IsTried = contract.IsTried,
                SpoonacularId = contract.SpoonacularId,
                Instructions = contract.Instructions
            };
        }
    }
}
