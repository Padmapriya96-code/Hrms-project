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
    public class PaymBanksController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymBanksController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymBanks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymBank>>> GetPaymBanks()
        {
            return await _context.PaymBanks.ToListAsync();
        }

        // GET: api/PaymBanks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymBank>> GetPaymBank(int id)
        {
            var paymBank = await _context.PaymBanks.FindAsync(id);

            if (paymBank == null)
            {
                return NotFound();
            }

            return paymBank;
        }

        // PUT: api/PaymBanks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymBank(int id, PaymBank paymBank)
        {
            if (id != paymBank.PnBankId)
            {
                return BadRequest();
            }

            _context.Entry(paymBank).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymBankExists(id))
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

        // POST: api/PaymBanks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymBank>> PostPaymBank(PaymBank paymBank)
        {
            _context.PaymBanks.Add(paymBank);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaymBank", new { id = paymBank.PnBankId }, paymBank);
        }

        // DELETE: api/PaymBanks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymBank(int id)
        {
            var paymBank = await _context.PaymBanks.FindAsync(id);
            if (paymBank == null)
            {
                return NotFound();
            }

            _context.PaymBanks.Remove(paymBank);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymBankExists(int id)
        {
            return _context.PaymBanks.Any(e => e.PnBankId == id);
        }
    }
}
