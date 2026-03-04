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
    public class PaymAttbonusController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymAttbonusController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymAttbonus
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymAttbonu>>> GetPaymAttbonus()
        {
            return await _context.PaymAttbonus.ToListAsync();
        }

        // GET: api/PaymAttbonus/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymAttbonu>> GetPaymAttbonu(int id)
        {
            var paymAttbonu = await _context.PaymAttbonus.FindAsync(id);

            if (paymAttbonu == null)
            {
                return NotFound();
            }

            return paymAttbonu;
        }

        // PUT: api/PaymAttbonus/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymAttbonu(int id, PaymAttbonu paymAttbonu)
        {
            if (id != paymAttbonu.AttbonusId)
            {
                return BadRequest();
            }

            _context.Entry(paymAttbonu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymAttbonuExists(id))
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

        // POST: api/PaymAttbonus
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymAttbonu>> PostPaymAttbonu(PaymAttbonu paymAttbonu)
        {
            _context.PaymAttbonus.Add(paymAttbonu);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaymAttbonu", new { id = paymAttbonu.AttbonusId }, paymAttbonu);
        }

        // DELETE: api/PaymAttbonus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymAttbonu(int id)
        {
            var paymAttbonu = await _context.PaymAttbonus.FindAsync(id);
            if (paymAttbonu == null)
            {
                return NotFound();
            }

            _context.PaymAttbonus.Remove(paymAttbonu);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymAttbonuExists(int id)
        {
            return _context.PaymAttbonus.Any(e => e.AttbonusId == id);
        }
    }
}
