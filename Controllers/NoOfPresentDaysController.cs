using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoOfPresentDaysController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public NoOfPresentDaysController(HrmsystemContext context)
        {
            _context = context;
        }

        [HttpGet("{companyId}/{branchId}/{employeeId}")]
        public async Task<ActionResult<int>> GetNoOfPresentDays(int companyId, int branchId, int employeeId)
        {

            try
            {
                var presentCount = await _context.PayInputs
                    .CountAsync(inputs => inputs.PnCompanyId == companyId && inputs.PnBranchId == branchId && inputs.PnEmployeeId == employeeId);

                return Ok(presentCount);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving present count: {ex.Message}");
            }
        }


    }
}
