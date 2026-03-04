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
    public class PayoutputLoansController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PayoutputLoansController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PayoutputLoans
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PayoutputLoan>>> GetPayoutputLoans()
        {
            return await _context.PayoutputLoans.ToListAsync();
        }

        // GET: api/PayoutputLoans/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PayoutputLoan>> GetPayoutputLoan(int id)
        {
            var payoutputLoan = await _context.PayoutputLoans.FindAsync(id);

            if (payoutputLoan == null)
            {
                return NotFound();
            }

            return payoutputLoan;
        }

        // PUT: api/PayoutputLoans/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayoutputLoan(int id, PayoutputLoan payoutputLoan)
        {
            if (id != payoutputLoan.Id)
            {
                return BadRequest();
            }

            _context.Entry(payoutputLoan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PayoutputLoanExists(id))
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

        // POST: api/PayoutputLoans
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PayoutputLoan>> PostPayoutputLoan(PayoutputLoan payoutputLoan)
        {
            _context.PayoutputLoans.Add(payoutputLoan);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPayoutputLoan", new { id = payoutputLoan.Id }, payoutputLoan);
        }

        // DELETE: api/PayoutputLoans/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayoutputLoan(int id)
        {
            var payoutputLoan = await _context.PayoutputLoans.FindAsync(id);
            if (payoutputLoan == null)
            {
                return NotFound();
            }

            _context.PayoutputLoans.Remove(payoutputLoan);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PayoutputLoanExists(int id)
        {
            return _context.PayoutputLoans.Any(e => e.Id == id);
        }
    }
}
