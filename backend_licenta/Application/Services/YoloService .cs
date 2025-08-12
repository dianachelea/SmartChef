using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Application.Services
{
    public class YoloService : IYoloService
    {
        public async Task<List<string>> DetectIngredientsAsync(string imagePath)
        {
            string fullPath = Path.GetFullPath(imagePath);
            string scriptPath = Path.Combine(AppContext.BaseDirectory, "PythonScripts", "detect.py");

            var psi = new ProcessStartInfo
            {
                FileName = "python",
                Arguments = $"\"{scriptPath}\" \"{fullPath}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
                WorkingDirectory = Path.Combine(AppContext.BaseDirectory, "PythonScripts")
            };

            try
            {
                using var process = Process.Start(psi);
                string output = await process.StandardOutput.ReadToEndAsync();
                string error = await process.StandardError.ReadToEndAsync();
                await process.WaitForExitAsync();

                //File.WriteAllText("detect_log.txt", output + "\n---\n" + error);

                Console.WriteLine(">>> PYTHON STDOUT:\n" + output);
                Console.WriteLine(">>> PYTHON STDERR:\n" + error);

                var lastValidJson = output.Split('\n')
                    .Select(l => l.Trim())
                    .Reverse()
                    .FirstOrDefault(l => l.StartsWith("[") && l.EndsWith("]"));

                if (string.IsNullOrWhiteSpace(lastValidJson))
                    return new List<string>();

                return JsonConvert.DeserializeObject<List<string>>(lastValidJson) ?? new List<string>();
            }
            catch (Exception ex)
            {
                Console.WriteLine(">>> EXCEPTION in YoloService: " + ex.Message);
                return new List<string>();
            }
        }
    }
}
