using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class putshiftdetailsbycompanyidController : ControllerBase
    {
        private HrmsystemContext context;

      

        public putshiftdetailsbycompanyidController(HrmsystemContext context)
        {
            this.context = context;
        }
        [HttpPut("{id}")]

        public async Task<ActionResult<IEnumerable<ShiftDetail>>> putshiftdetailsbycompanyid(int id)
        {

            var query = await (from shift_details in context.ShiftDetails
                               join paym_Employees in context.PaymEmployees on shift_details.PnCompanyid equals paym_Employees.PnCompanyId
                               where
                                       shift_details.PnCompanyid == paym_Employees.PnCompanyId &&
                                       shift_details.PnCompanyid == paym_Employees.PnBranchId
                               select shift_details).ToListAsync();
            return query;
        }
        
        }

    }

