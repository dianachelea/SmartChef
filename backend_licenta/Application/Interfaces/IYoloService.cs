using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IYoloService
    {
        Task<List<string>> DetectIngredientsAsync(string imagePath);
    }
}
