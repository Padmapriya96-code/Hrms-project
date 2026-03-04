using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TotalLeaveDaysController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public TotalLeaveDaysController(HrmsystemContext context)
        {
            _context = context;
        }

        [HttpGet("{companyId}/{branchId}/{employeeId}")]
        public async Task<ActionResult<int>> GetTotalLeaveDays(int companyId, int branchId, int employeeId)
        {
            try
            {
                // Get total number of days absent (including paid leaves)
                var totalLeaveDays = await _context.PayInputs
                    .Where(record => record.PnEmployeeId == employeeId && record.PnBranchId == branchId && record.PnCompanyId == companyId)
                    .SumAsync(record => record.TotLeaveDays); // Add 1 to include both start and end days

                return Ok(totalLeaveDays);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving total leave days count: {ex.Message}");
            }
        }
    }
}
