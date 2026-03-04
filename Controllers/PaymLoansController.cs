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
    public class PaymLoansController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymLoansController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymLoans
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymLoan>>> GetPaymLoans()
        {
            return await _context.PaymLoans.ToListAsync();
        }

        // GET: api/PaymLoans/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymLoan>> GetPaymLoan(int id)
        {
            var paymLoan = await _context.PaymLoans.FindAsync(id);

            if (paymLoan == null)
            {
                return NotFound();
            }

            return paymLoan;
        }

        // PUT: api/PaymLoans/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymLoan(int id, PaymLoan paymLoan)
        {
            if (id != paymLoan.PnCompanyid)
            {
                return BadRequest();
            }

            _context.Entry(paymLoan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymLoanExists(id))
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

        // POST: api/PaymLoans
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymLoan>> PostPaymLoan(PaymLoan paymLoan)
        {
            _context.PaymLoans.Add(paymLoan);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PaymLoanExists(paymLoan.PnCompanyid))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPaymLoan", new { id = paymLoan.PnCompanyid }, paymLoan);
        }

        // DELETE: api/PaymLoans/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymLoan(int id)
        {
            var paymLoan = await _context.PaymLoans.FindAsync(id);
            if (paymLoan == null)
            {
                return NotFound();
            }

            _context.PaymLoans.Remove(paymLoan);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymLoanExists(int id)
        {
            return _context.PaymLoans.Any(e => e.PnCompanyid == id);
        }
    }
}
