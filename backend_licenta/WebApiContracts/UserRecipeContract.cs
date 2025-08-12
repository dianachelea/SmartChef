using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApiContracts
{
    public class UserRecipeContract
    {
        public Guid? Id { get; set; }  
        public string Title { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public int Serving { get; set; }
        public int ReadyInMinutes { get; set; }
        public int CookingMinutes { get; set; }
        public int PreparationMinutes { get; set; }
        public string Ingredients { get; set; } = string.Empty;
        public decimal Calories { get; set; }  
        public bool IsFavorite { get; set; } = false;
        public bool IsTried { get; set; } = false;
        public int? SpoonacularId { get; set; }

        public string Instructions { get;set; } = string.Empty;
    }
}
