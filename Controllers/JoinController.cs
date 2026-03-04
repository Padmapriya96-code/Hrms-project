using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JoinController : ControllerBase
    {
        HrmsystemContext _context;
        public JoinController(HrmsystemContext _context) { 
        
            this._context = _context;
        }
        [HttpPost("{joinquery}")]
        public IEnumerable<Object>  GetJoinData(string joinquery)
        {
            System.FormattableString formattable = $"select count(*) from Paym_Employee";
           IEnumerable<Object> data = _context.Database.SqlQuery<Object>(formattable);

            return data;


        }
    }
}
