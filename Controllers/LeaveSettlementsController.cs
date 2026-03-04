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
    public class LeaveSettlementsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public LeaveSettlementsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/LeaveSettlements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeaveSettlement>>> GetLeaveSettlements()
        {
            return await _context.LeaveSettlements.ToListAsync();
        }

        // GET: api/LeaveSettlements/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LeaveSettlement>> GetLeaveSettlement(int id)
        {
            var leaveSettlement = await _context.LeaveSettlements.FindAsync(id);

            if (leaveSettlement == null)
            {
                return NotFound();
            }

            return leaveSettlement;
        }

        // PUT: api/LeaveSettlements/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLeaveSettlement(int id, LeaveSettlement leaveSettlement)
        {
            if (id != leaveSettlement.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(leaveSettlement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeaveSettlementExists(id))
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

        // POST: api/LeaveSettlements
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LeaveSettlement>> PostLeaveSettlement(LeaveSettlement leaveSettlement)
        {
            _context.LeaveSettlements.Add(leaveSettlement);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (LeaveSettlementExists(leaveSettlement.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetLeaveSettlement", new { id = leaveSettlement.PnCompanyId }, leaveSettlement);
        }

        // DELETE: api/LeaveSettlements/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveSettlement(int id)
        {
            var leaveSettlement = await _context.LeaveSettlements.FindAsync(id);
            if (leaveSettlement == null)
            {
                return NotFound();
            }

            _context.LeaveSettlements.Remove(leaveSettlement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LeaveSettlementExists(int id)
        {
            return _context.LeaveSettlements.Any(e => e.PnCompanyId == id);
        }
    }
}
