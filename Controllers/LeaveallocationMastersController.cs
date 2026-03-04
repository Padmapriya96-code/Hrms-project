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
    public class LeaveallocationMastersController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public LeaveallocationMastersController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/LeaveallocationMasters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeaveallocationMaster>>> GetLeaveallocationMasters()
        {
            return await _context.LeaveallocationMasters.ToListAsync();
        }

        // GET: api/LeaveallocationMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LeaveallocationMaster>> GetLeaveallocationMaster(int id)
        {
            var leaveallocationMaster = await _context.LeaveallocationMasters.FindAsync(id);

            if (leaveallocationMaster == null)
            {
                return NotFound();
            }

            return leaveallocationMaster;
        }

        // PUT: api/LeaveallocationMasters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLeaveallocationMaster(int id, LeaveallocationMaster leaveallocationMaster)
        {
            if (id != leaveallocationMaster.Id)
            {
                return BadRequest();
            }

            _context.Entry(leaveallocationMaster).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeaveallocationMasterExists(id))
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

        // POST: api/LeaveallocationMasters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LeaveallocationMaster>> PostLeaveallocationMaster(LeaveallocationMaster leaveallocationMaster)
        {
            _context.LeaveallocationMasters.Add(leaveallocationMaster);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLeaveallocationMaster", new { id = leaveallocationMaster.Id }, leaveallocationMaster);
        }

        // DELETE: api/LeaveallocationMasters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveallocationMaster(int id)
        {
            var leaveallocationMaster = await _context.LeaveallocationMasters.FindAsync(id);
            if (leaveallocationMaster == null)
            {
                return NotFound();
            }

            _context.LeaveallocationMasters.Remove(leaveallocationMaster);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LeaveallocationMasterExists(int id)
        {
            return _context.LeaveallocationMasters.Any(e => e.Id == id);
        }
    }
}
