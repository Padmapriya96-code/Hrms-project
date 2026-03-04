using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class getshiftmonthbycompanyidController : ControllerBase
    {
        private HrmsystemContext context;

        public getshiftmonthbycompanyidController(HrmsystemContext context)
        {
            this.context = context;
        }
        [HttpGet("{id},{monyear}")]
        public async Task<ActionResult<IEnumerable<ShiftMonth>>> getshiftmonthbycompanyid(String id,String monyear)
        {
            var query = await (from shift_month in context.ShiftMonths
                                    join paym_Employees in context.PaymEmployees on shift_month.PnCompanyId equals paym_Employees.PnCompanyId
                                    where shift_month.PnCompanyId == paym_Employees.PnCompanyId && shift_month.PnBranchId == paym_Employees.PnBranchId && shift_month.PnEmployeeCode ==id
                     && shift_month.Monthyear == monyear
                                    select shift_month).ToListAsync();
            return query;

        }
    }

}
