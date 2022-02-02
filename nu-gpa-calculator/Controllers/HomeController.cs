using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using nu_gpa_calculator.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace nu_gpa_calculator.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult CalculateGpa(int percentage)
        {
            string[] result = new string[2];
            if( percentage >= 95)
            {
                result[0] = "A";
                result[1] = "4.00";
            }
            else if (percentage < 95 && percentage >= 90)
            {
                result[0] = "A-";
                result[1] = "3.67";
            }
            else if (percentage < 90 && percentage >= 85)
            {
                result[0] = "B+";
                result[1] = "3.33";
            }
            else if (percentage < 85 && percentage >= 80)
            {
                result[0] = "B";
                result[1] = "3.00";
            }
            else if (percentage < 80 && percentage >= 75)
            {
                result[0] = "B-";
                result[1] = "2.67";
            }
            else if (percentage < 75 && percentage >= 70)
            {
                result[0] = "C+";
                result[1] = "2.33";
            }
            else if (percentage < 70 && percentage >= 65)
            {
                result[0] = "C";
                result[1] = "2.00";
            }
            else if (percentage < 65 && percentage >= 60)
            {
                result[0] = "C-";
                result[1] = "1.67";
            }
            else if (percentage < 60 && percentage >= 55)
            {
                result[0] = "D+";
                result[1] = "1.33";
            }
            else if (percentage < 55 && percentage >= 50)
            {
                result[0] = "D";
                result[1] = "1.00";
            }
            else
            {
                result[0] = "F";
                result[1] = "0.00";
            }
            return new JsonResult(result);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
