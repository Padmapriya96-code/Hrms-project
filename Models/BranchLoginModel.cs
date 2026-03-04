using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRMSAPPLICATION.Models
{

    //public class BranchLoginModel 
    //{
    //    public string username { get; set; }
    //    public string password { get; set; }
    //}

    //public class BranchLoginModel
    //{
    //    public string username { get; set; }
    //    public string password { get; set; }
    //    public string status { get; set; }
    //}

    public class BranchLoginModel
    {
        public string username { get; set; }
        public string password { get; set; }
        public string status { get; set; }
        public DateTime startdate { get; set; }
        public DateTime enddate { get; set; }
    }


}
