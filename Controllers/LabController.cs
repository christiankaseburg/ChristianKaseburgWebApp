using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ChristianKaseburgWebsite.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ChristianKaseburgWebsite.Controllers
{
    [Route("api/[controller]")] // api/Lab
    [Route("[controller]/{id}")] // experiment index.html plz
    public class LabController : Controller
    {
        // Temp static data
        private static Experiment[] _experiments = new Experiment[]
        {
            new Experiment {
                Id = 0,
                Title = new char[] {'G', 'o', 'd', 'r', 'a', 'y', 's' },
                Subtitle = "Volumentric Lighting",
                Tags = "[ WebGl / Instanced / PostProcessing / GPGPU ]",
                Date = "Feb 2018",
                Route = "godrays",
                Video = "/assets/videos/godrays.mp4",
                Image = "/assets/imgs/godrays/godrays_thumbnail.jpg"
            }
        };

        public IActionResult Index(string id)
        {
            if (id == "godrays")
            {
                return View("~/Views/Lab/" + id + "/index.cshtml");
            } else
            {
                return View();
            }
        }

        [HttpGet("[action]")]
        public IActionResult GetExperiments()
        {
            return new ObjectResult(_experiments);
        }
    }
}
