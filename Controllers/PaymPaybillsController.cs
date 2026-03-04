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
    public class PaymPaybillsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymPaybillsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymPaybills
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymPaybill>>> GetPaymPaybills()
        {
            return await _context.PaymPaybills.ToListAsync();
        }

        // GET: api/PaymPaybills/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymPaybill>> GetPaymPaybill(int id)
        {
            var paymPaybill = await _context.PaymPaybills.FindAsync(id);

            if (paymPaybill == null)
            {
                return NotFound();
            }

            return paymPaybill;
        }

        // PUT: api/PaymPaybills/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymPaybill(int id, PaymPaybill paymPaybill)
        {
            if (id != paymPaybill.Id)
            {
                return BadRequest();
            }

            _context.Entry(paymPaybill).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymPaybillExists(id))
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

        // POST: api/PaymPaybills
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymPaybill>> PostPaymPaybill(PaymPaybill paymPaybill)
        {
            _context.PaymPaybills.Add(paymPaybill);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaymPaybill", new { id = paymPaybill.Id }, paymPaybill);
        }

        // DELETE: api/PaymPaybills/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymPaybill(int id)
        {
            var paymPaybill = await _context.PaymPaybills.FindAsync(id);
            if (paymPaybill == null)
            {
                return NotFound();
            }

            _context.PaymPaybills.Remove(paymPaybill);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymPaybillExists(int id)
        {
            return _context.PaymPaybills.Any(e => e.Id == id);
        }
    }
}
