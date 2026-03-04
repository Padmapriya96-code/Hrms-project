using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Collections.Specialized.BitVector32;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class getHrAuthenticationbycompanyidController : ControllerBase
    {
        private HrmsystemContext context;

        public getHrAuthenticationbycompanyidController(HrmsystemContext context)
        {
            this.context = context;
        }
        [HttpGet("{id}")]

        public async Task<ActionResult<IEnumerable<HrAuthentication>>> HrAuthenticationbycompanyid(int id)
        {

            var query = await (from hr_authentication in context.HrAuthentications
                               join paym_Employees in context.PaymEmployees on hr_authentication.PnCompanyId equals paym_Employees.PnCompanyId
                               where hr_authentication.PnCompanyId == paym_Employees.PnCompanyId && hr_authentication.PnBranchId == paym_Employees.PnBranchId && hr_authentication.SectionId == 2
                && hr_authentication.SectionView == "No"
                               select hr_authentication).ToListAsync();
            return query;
        }
    }
}
