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
    public class OTLimitController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public OTLimitController(HrmsystemContext context)
        {
            _context = context;
        }

        [HttpGet("{companyId}/{branchId}")]
        public async Task<ActionResult<int>> GetOTLimit(int companyId, int branchId)
        {
            try
            {
                // Retrieve the total OT limit (in minutes) based on companyId and branchId
                var totalOTLimitMinutes = await _context.AttendanceCeilings
                    .Where(record => record.PnBranchid == branchId && record.PnCompanyid == companyId)
                    .SumAsync(record => record.OtHrs * 60 + record.OtLimit;

                return Ok(totalOTLimitMinutes);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving OT limit value: {ex.Message}");
            }
        }
    }
}*/
