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
    public class TotalHalfDaysController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public TotalHalfDaysController(HrmsystemContext context)
        {
            _context = context;
        }

        [HttpGet("{companyId}/{branchId}")]
        public async Task<ActionResult<bool>> GetTotalHalfDays(int companyId, int branchId)
        {
            try
            {
                // Retrieve the halfday value based on companyId and branchId
                var halfDay = await _context.AttendanceCeilings
                    .Where(record => record.PnBranchid == branchId && record.PnCompanyid == companyId)
                    .Select(record => record.Halfday)
                    .FirstOrDefaultAsync();

                if (halfDay != null)
                {
                    return Ok(halfDay);
                }
                else
                {
                    return NotFound("HalfDay not found for the specified company and branch.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving HalfDay value: {ex.Message}");
            }
        }
    }
}
