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
    public class EarlyIntimeController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public EarlyIntimeController(HrmsystemContext context)
        {
            _context = context;
        }

        [HttpGet("{companyId}/{branchId}")]
        public async Task<ActionResult<DateTime?>> GetEarlyIntime(int companyId, int branchId)
        {
            try
            {
                // Retrieve the minimum early_intime value based on companyId and branchId
                var earlyIntime = await _context.AttendanceCeilings
                    .Where(record => record.PnBranchid == branchId && record.PnCompanyid == companyId)
                    .MinAsync(record => record.EarlyIntime);

                if (earlyIntime != null)
                {
                    return Ok(earlyIntime);
                }
                else
                {
                    return NotFound("EarlyIntime not found for the specified company and branch.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving EarlyIntime value: {ex.Message}");
            }
        }
    }
}
