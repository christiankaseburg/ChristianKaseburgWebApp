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
    [Route("[controller]/{id}")] // display project
    public class PortfolioController : Controller
    {
        // Temp static data
        private static Project[] _Project = new Project[]
        {
            new Project {
                Id = 0,
                Title = new char[] {'B', 'u', 'i', 's', 'n', 'e', 's', 's', '\xa0', 'F', 'o', 'r', 'm' },
                Subtitle = "Buisness Logic",
                Tags = "[ Vanilla JS / Webform ]",
                Date = "June 2018",
                Route = "portfolio/buisnessform",
                Image = "/assets/imgs/buisnessform/buisnessform.jpg"
            },
            new Project {
                Id = 1,
                Title = new char[] {'A', 'l', 'i', 'c', 'i', 'a', '\xa0', 'A', 'l', 'e', 'x', 'a', 'n', 'd', 'e', 'r' },
                Subtitle = "Skincare Shop",
                Tags = "[ Angular ]",
                Date = "March 2018",
                Route = "http://aliciaalexander.net",
                Image = "/assets/imgs/aliciaalexander/aliciaalexander_thumbnail.jpg"
            },
            new Project {
                Id = 2,
                Title = new char[] {'I', 'n', 's', 't', 'a', 'g', 'r', 'a', 'm', '\xa0', 'S', 'e', 'a', 'r', 'c', 'h', 'e', 'r' },
                Subtitle = "Search Engine Mock up",
                Tags = "[ Angular ]",
                Date = "May 2018",
                Route = "https://instagramurlsearcher.herokuapp.com/",
                Image = "/assets/imgs/instagramsearcher/instagramsearcher.jpg"
            },
            new Project {
                Id = 3,
                Title = new char[] {'A', 'u', 't', 'o', 'm', 'e', 'd' },
                Subtitle = "Client Intake Software",
                Tags = "[ ASP.NET ]",
                Date = "Feb 2017",
                Route = null,
                Image = "/assets/imgs/automed/automed_thumbnail.jpg"
            }
        };

        public IActionResult Index(string id)
        {
            if (id == "buisnessform")
            {
                return View("~/Views/Portfolio/" + id + "/index.cshtml");
            }
            else
            {
                return View();
            }
        }

        [HttpGet("[action]")]
        public IActionResult GetProjects()
        {
            return new ObjectResult(_Project);
        }
    }
}
