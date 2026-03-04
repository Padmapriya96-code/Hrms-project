using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class getshiftdetailsbycompanyidController : ControllerBase
    {

        private HrmsystemContext context;

        public getshiftdetailsbycompanyidController(HrmsystemContext context)
        {
            this.context = context;
        }
        [HttpGet("{id}")]

        public async Task<ActionResult<IEnumerable<ShiftDetail>>> getshiftdetailsbycompanyid(string id)
        {

            var query = await(from shift_details in context.ShiftDetails join paym_Employees in context.PaymEmployees on shift_details.PnCompanyid equals paym_Employees.PnCompanyId
                        where shift_details.PnCompanyid == paym_Employees.PnCompanyId  && shift_details.PnBranchid == paym_Employees.PnBranchId
                        select shift_details).ToListAsync();
            return query;



            
        }
    }

}
    
