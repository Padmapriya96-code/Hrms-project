using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AggregateController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public AggregateController(HrmsystemContext context)
        {
            _context = context;
        }

        [HttpGet("{companyId}/{branchId}")]
        public async Task<ActionResult<int>> GetSummary(int companyId, int branchId)
        {
            try
            {
                var leaveCount = await _context.PaymLeaves
                    .CountAsync(leave => leave.PnCompanyId == companyId && leave.PnBranchId == branchId);

                return Ok(leaveCount);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving leave count: {ex.Message}");
            }
        }


        [HttpGet]

        public async Task<ActionResult<int>> GetSummary()
        {
            var data = await _context.PaymLeaves.CountAsync(leave => true);
            return Ok(data);
        }

    }



}
