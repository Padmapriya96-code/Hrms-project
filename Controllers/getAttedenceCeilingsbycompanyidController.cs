using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class getAttedenceCeilingsbycompanyidController : ControllerBase
    {

        private HrmsystemContext context;

        public getAttedenceCeilingsbycompanyidController(HrmsystemContext context)
        {
            this.context = context;
        }
        [HttpGet("{id}")]

        public async Task<ActionResult<IEnumerable<AttendanceCeiling>>> getAttedenceCeilingsbycompanyid(int id)
        {

            var query = await (from attendence_ceiling in context.AttendanceCeilings
                               join paym_Employees in context.PaymEmployees on attendence_ceiling.PnCompanyid equals paym_Employees.PnCompanyId
                               where attendence_ceiling.PnCompanyid == paym_Employees.PnCompanyId && attendence_ceiling.PnBranchid == paym_Employees.PnBranchId
                               select attendence_ceiling).ToListAsync();
            return query;
        }
    }
}
