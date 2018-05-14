using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChristianKaseburgWebsite.Models
{
    public class Project
    {
        public int Id { get; set; }
        public char[] Title { get; set; }
        public string Subtitle { get; set; }
        public string Tags { get; set; }
        public string Date { get; set; }
        public string Route { get; set; }
        public string Image { get; set; }
    }
}
