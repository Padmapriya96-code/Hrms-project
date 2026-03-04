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
    public class PayOutputEarningsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PayOutputEarningsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PayOutputEarnings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PayOutputEarning>>> GetPayOutputEarnings()
        {
            return await _context.PayOutputEarnings.ToListAsync();
        }

        // GET: api/PayOutputEarnings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PayOutputEarning>> GetPayOutputEarning(int id)
        {
            var payOutputEarning = await _context.PayOutputEarnings.FindAsync(id);

            if (payOutputEarning == null)
            {
                return NotFound();
            }

            return payOutputEarning;
        }

        // PUT: api/PayOutputEarnings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayOutputEarning(int id, PayOutputEarning payOutputEarning)
        {
            if (id != payOutputEarning.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(payOutputEarning).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PayOutputEarningExists(id))
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

        // POST: api/PayOutputEarnings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PayOutputEarning>> PostPayOutputEarning(PayOutputEarning payOutputEarning)
        {
            _context.PayOutputEarnings.Add(payOutputEarning);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PayOutputEarningExists(payOutputEarning.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPayOutputEarning", new { id = payOutputEarning.PnCompanyId }, payOutputEarning);
        }

        // DELETE: api/PayOutputEarnings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayOutputEarning(int id)
        {
            var payOutputEarning = await _context.PayOutputEarnings.FindAsync(id);
            if (payOutputEarning == null)
            {
                return NotFound();
            }

            _context.PayOutputEarnings.Remove(payOutputEarning);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PayOutputEarningExists(int id)
        {
            return _context.PayOutputEarnings.Any(e => e.PnCompanyId == id);
        }
    }
}
