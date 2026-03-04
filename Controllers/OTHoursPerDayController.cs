/*using HRMSAPPLICATION.Models;
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
    public class OTHoursPerDayController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public OTHoursPerDayController(HrmsystemContext context)
        {
            _context = context;
        }

        [HttpGet("{companyId}/{branchId}/{employeeId}")]
        public async Task<ActionResult<TimeSpan>> GetOTHoursPerDay(int companyId, int branchId, int employeeId)
        {
            try
            {
                // Assuming you have a threshold for overtime, such as 8 hours per day
                TimeSpan threshold = TimeSpan.FromHours(8);

                // Get total OT hours per day for the specified employee
                var totalOTHoursPerDay = await _context.PayInputs
                    .Where(hours => hours.PnEmployeeId == employeeId && hours.PnBranchId == branchId && hours.PnCompanyId == companyId && hours.OtHrs > threshold)
                    .GroupBy(hours => hours.WorkDate.Date)
                    .Select(group => new
                    {
                        Date = group.Key,
                        TotalOTHours = group.Sum(hours => hours.HoursWorked - threshold) // Subtract threshold to get OT hours
                    })
                    .ToListAsync();

                return Ok(totalOTHoursPerDay);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving total OT hours per day: {ex.Message}");
            }
        }
    }
}
*/