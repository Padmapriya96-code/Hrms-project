using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;
using HRMSAPPLICATION.Extensions;
namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymousJwt]
    public class ReportsController : ControllerBase
    {
        HrmsystemContext _context;
        public ReportsController(HrmsystemContext _context)
        {
            this._context = _context;
        }
        [HttpPost]
        [HttpPost]
        public async Task<IActionResult> GetReports([FromBody] Report report)
        {
            // Ensure report and report.Query are not null
            if (report == null || string.IsNullOrEmpty(report.Query))
            {
                return BadRequest("Invalid report or query.");
            }

            try
            {
                // Execute the raw SQL query and map the results to a dynamic list
                var result = await _context.Database.SqlQueryAsync(report.Query);

                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the exception
                // _logger.LogError(ex, "Error executing report query");

                return StatusCode(500, "Internal server error");
            }
        }
    }
}
