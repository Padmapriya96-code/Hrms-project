using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveapproveHrsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public LeaveapproveHrsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/LeaveapproveHrs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeaveapproveHr>>> GetLeaveapproveHrs()
        {
            return await _context.LeaveapproveHrs.ToListAsync();
        }

        // GET: api/LeaveapproveHrs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LeaveapproveHr>> GetLeaveapproveHr(int id)
        {
            var leaveapproveHr = await _context.LeaveapproveHrs.FindAsync(id);

            if (leaveapproveHr == null)
            {
                return NotFound();
            }

            return leaveapproveHr;
        }

        // PUT: api/LeaveapproveHrs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLeaveapproveHr(int id, LeaveapproveHr leaveapproveHr)
        {
            if (id != leaveapproveHr.Sno)
            {
                return BadRequest();
            }

            _context.Entry(leaveapproveHr).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeaveapproveHrExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/LeaveapproveHrs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LeaveapproveHr>> PostLeaveapproveHr(LeaveapproveHr leaveapproveHr)
        {
            _context.LeaveapproveHrs.Add(leaveapproveHr);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLeaveapproveHr", new { id = leaveapproveHr.Sno }, leaveapproveHr);
        }

        // DELETE: api/LeaveapproveHrs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveapproveHr(int id)
        {
            var leaveapproveHr = await _context.LeaveapproveHrs.FindAsync(id);
            if (leaveapproveHr == null)
            {
                return NotFound();
            }

            _context.LeaveapproveHrs.Remove(leaveapproveHr);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LeaveapproveHrExists(int id)
        {
            return _context.LeaveapproveHrs.Any(e => e.Sno == id);
        }
    }
}
