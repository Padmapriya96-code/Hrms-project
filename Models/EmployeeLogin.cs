using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRMSAPPLICATION.Models
{

    public class EmployeeLogin
    {
        public string username { get; set; }
        public string password { get; set; }
    }
}