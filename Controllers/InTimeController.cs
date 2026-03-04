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
    public class IntimeController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public IntimeController(HrmsystemContext context)
        {
            _context = context;
        }

        [HttpGet("{companyId}/{branchId}")]
        public async Task<ActionResult<DateTime>> GetIntime(int companyId, int branchId)
        {
            try
            {
                // Retrieve the Intime value based on companyId and branchId
                var intime = await _context.AttendanceCeilings
                    .Where(record => record.PnBranchid == branchId && record.PnCompanyid == companyId)
                    .Select(record => record.Intime)
                    .FirstOrDefaultAsync();

                if (intime != null)
                {
                    return Ok(intime);
                }
                else
                {
                    return NotFound("Intime not found for the specified company and branch.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving Intime value: {ex.Message}");
            }
        }
    }
}
