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
    public class PaymEarningsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymEarningsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymEarnings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymEarning>>> GetPaymEarnings()
        {
            return await _context.PaymEarnings.ToListAsync();
        }

        // GET: api/PaymEarnings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymEarning>> GetPaymEarning(int id)
        {
            var paymEarning = await _context.PaymEarnings.FindAsync(id);

            if (paymEarning == null)
            {
                return NotFound();
            }

            return paymEarning;
        }

        // PUT: api/PaymEarnings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymEarning(int id, PaymEarning paymEarning)
        {
            if (id != paymEarning.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(paymEarning).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymEarningExists(id))
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

        // POST: api/PaymEarnings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymEarning>> PostPaymEarning(PaymEarning paymEarning)
        {
            _context.PaymEarnings.Add(paymEarning);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PaymEarningExists(paymEarning.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPaymEarning", new { id = paymEarning.PnCompanyId }, paymEarning);
        }

        // DELETE: api/PaymEarnings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymEarning(int id)
        {
            var paymEarning = await _context.PaymEarnings.FindAsync(id);
            if (paymEarning == null)
            {
                return NotFound();
            }

            _context.PaymEarnings.Remove(paymEarning);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymEarningExists(int id)
        {
            return _context.PaymEarnings.Any(e => e.PnCompanyId == id);
        }
    }
}
