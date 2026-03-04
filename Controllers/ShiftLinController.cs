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
    public class ShiftLinController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public ShiftLinController(HrmsystemContext context)
        {
            _context = context;
        }

        [HttpGet("{companyId}/{branchId}")]
        public async Task<ActionResult<string>> GetShiftLin(int companyId, int branchId)
        {
            try
            {
                // Retrieve the maximum shift_lin value based on companyId and branchId
                var shiftLin = await _context.AttendanceCeilings
                    .Where(record => record.PnBranchid == branchId && record.PnCompanyid == companyId)
                    .MaxAsync(record => record.ShiftLin);

                if (shiftLin != null)
                {
                    return Ok(shiftLin);
                }
                else
                {
                    return NotFound("ShiftLin not found for the specified company and branch.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving ShiftLin value: {ex.Message}");
            }
        }
    }
}
