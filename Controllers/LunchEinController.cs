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
    public class LunchEinController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public LunchEinController(HrmsystemContext context)
        {
            _context = context;
        }

        [HttpGet("{companyId}/{branchId}")]
        public async Task<ActionResult<DateTime?>> GetLunchEin(int companyId, int branchId)
        {
            try
            {
                // Retrieve the maximum lunch_ein value based on companyId and branchId
                var lunchEin = await _context.AttendanceCeilings
                    .Where(record => record.PnBranchid == branchId && record.PnCompanyid == companyId)
                    .MaxAsync(record => record.LunchEin);

                if (lunchEin != null)
                {
                    return Ok(lunchEin);
                }
                else
                {
                    return NotFound("LunchEin not found for the specified company and branch.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving LunchEin value: {ex.Message}");
            }
        }
    }
}
