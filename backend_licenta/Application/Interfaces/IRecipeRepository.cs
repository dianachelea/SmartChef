using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IRecipeRepository
    {
        Task<IEnumerable<Recipe>> GetAllByUser(Guid userId);
        Task<Recipe?> GetById(Guid id);
        Task<IEnumerable<Recipe>> GetFavoritesByUser(Guid userId);
        Task<IEnumerable<Recipe>> GetTriedByUser(Guid userId);
        Task AddRecipe(Recipe recipe);
        Task UpdateRecipe(Recipe recipe);
        Task DeleteRecipe(Guid id, Guid userId);
    }

}
