using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using WebApiContracts;
using System.Drawing;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : Controller
    {
        private readonly IYoloService _yoloService;

        public UploadController(IYoloService yoloService)
        {
            _yoloService = yoloService;
        }

        [HttpPost("detect")]
        public async Task<IActionResult> Detect(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            Directory.CreateDirectory(uploadsPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
                await stream.FlushAsync();
            }

            try
            {
                using var img = System.Drawing.Image.FromFile(filePath);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Invalid image: " + ex.Message);
                return BadRequest("Uploaded file is not a valid image.");
            }

            var detected = await _yoloService.DetectIngredientsAsync(filePath);
            return Ok(new DetectedIngredientsResponse { Ingredients = detected });
        }
    }
}
