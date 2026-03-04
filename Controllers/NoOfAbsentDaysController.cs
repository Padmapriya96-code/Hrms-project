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
    public class NoOfAbsentDaysController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public NoOfAbsentDaysController(HrmsystemContext context)
        {
            _context = context;
        }

        [HttpGet("{companyId}/{branchId}/{employeeId}")]
        public async Task<ActionResult<long>> GetAbsentLeaveDays(int companyId, int branchId, int employeeId)
        {
            try
            {
                // Get total number of paid leave days
                var paidLeaveDays = await _context.PayInputs
                    .Where(inputs => inputs.PnCompanyId == companyId && inputs.PnBranchId == branchId && inputs.PnEmployeeId == employeeId)
                    .SumAsync(inputs => inputs.PaidDays);

                // Get total number of days absent
                var totalAbsentDays = await _context.LeaveApplys
                    .Where(record => record.PnEmployeeId == employeeId && record.PnBranchId == branchId && record.PnCompanyId == companyId)
                    .SumAsync(record => (record.Days)); // Add 1 to include both start and end days

                var noOfDaysAbsent = paidLeaveDays - totalAbsentDays;

                return Ok(noOfDaysAbsent);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving no of days absent: {ex.Message}");
            }
        }
    }
}
