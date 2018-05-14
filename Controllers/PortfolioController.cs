using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ChristianKaseburgWebsite.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ChristianKaseburgWebsite.Controllers
{
    [Route("api/[controller]")] // api/Portfolio
    public class PortfolioController : Controller
    {
        // Temp static data
        private static Project[] _Project = new Project[]
        {
            new Project {
                Id = 0,
                Title = new char[] {'A', 'u', 't', 'o', 'm', 'e', 'd' },
                Subtitle = "Client Intake Software",
                Tags = "[ ASP.NET ]",
                Date = "Feb 2017",
                Route = null,
                Image = "/assets/imgs/automed/automed_thumbnail.jpg"
            },
            new Project {
                Id = 1,
                Title = new char[] {'A', 'l', 'i', 'c', 'i', 'a', '\xa0', 'A', 'l', 'e', 'x', 'a', 'n', 'd', 'e', 'r' },
                Subtitle = "Skincare Shop",
                Tags = "[ Angular ]",
                Date = "March 2018",
                Route = "http://aliciaalexander.net",
                Image = "/assets/imgs/aliciaalexander/aliciaalexander_thumbnail.jpg"
            }
        };

        [HttpGet("[action]")]
        public IActionResult GetProjects()
        {
            return new ObjectResult(_Project);
        }
    }
}
