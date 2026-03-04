using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoOfPaidLeaveDaysController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public NoOfPaidLeaveDaysController(HrmsystemContext context)
        {
            _context = context;
        }

        [HttpGet("{companyId}/{branchId}/{employeeId}")]
        public async Task<ActionResult<int>> GetNoOfPaidLeaveDays(int companyId, int branchId, int employeeId)
        {
            try
            {
                // Sum the PaidLeaveDays field for the specified employee
                var totalPaidLeaveDays = await _context.PayInputs
                    .Where(inputs => inputs.PnCompanyId == companyId && inputs.PnBranchId == branchId && inputs.PnEmployeeId == employeeId)
                    .SumAsync(inputs => inputs.PaidDays);

                return Ok(totalPaidLeaveDays);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving paid leave days count: {ex.Message}");
            }
        }
    }
}
