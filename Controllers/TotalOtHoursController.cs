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
    public class TotalOTHoursController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public TotalOTHoursController(HrmsystemContext context)
        {
            _context = context;
        }

        [HttpGet("{companyId}/{branchId}")]
        public async Task<ActionResult<decimal>> GetTotalOTHours(int companyId, int branchId)
        {
            try
            {
                // Retrieve the total overtime hours worked based on companyId and branchId
                var totalOTHours = await _context.AttendanceCeilings
                    .Where(record => record.PnBranchid == branchId && record.PnCompanyid == companyId)
                    .Select(record => record.OtHrs)
                    .SumAsync();

                return Ok(totalOTHours);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving total OT hours: {ex.Message}");
            }
        }
    }
}
