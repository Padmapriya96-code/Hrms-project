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
    public class PaymLoanDiminishingsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymLoanDiminishingsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymLoanDiminishings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymLoanDiminishing>>> GetPaymLoanDiminishings()
        {
            return await _context.PaymLoanDiminishings.ToListAsync();
        }

        // GET: api/PaymLoanDiminishings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymLoanDiminishing>> GetPaymLoanDiminishing(int id)
        {
            var paymLoanDiminishing = await _context.PaymLoanDiminishings.FindAsync(id);

            if (paymLoanDiminishing == null)
            {
                return NotFound();
            }

            return paymLoanDiminishing;
        }

        // PUT: api/PaymLoanDiminishings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymLoanDiminishing(int id, PaymLoanDiminishing paymLoanDiminishing)
        {
            if (id != paymLoanDiminishing.Id)
            {
                return BadRequest();
            }

            _context.Entry(paymLoanDiminishing).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymLoanDiminishingExists(id))
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

        // POST: api/PaymLoanDiminishings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymLoanDiminishing>> PostPaymLoanDiminishing(PaymLoanDiminishing paymLoanDiminishing)
        {
            _context.PaymLoanDiminishings.Add(paymLoanDiminishing);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaymLoanDiminishing", new { id = paymLoanDiminishing.Id }, paymLoanDiminishing);
        }

        // DELETE: api/PaymLoanDiminishings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymLoanDiminishing(int id)
        {
            var paymLoanDiminishing = await _context.PaymLoanDiminishings.FindAsync(id);
            if (paymLoanDiminishing == null)
            {
                return NotFound();
            }

            _context.PaymLoanDiminishings.Remove(paymLoanDiminishing);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymLoanDiminishingExists(int id)
        {
            return _context.PaymLoanDiminishings.Any(e => e.Id == id);
        }
    }
}
