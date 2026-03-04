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
    public class PaymComputationsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymComputationsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymComputations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymComputation>>> GetPaymComputations()
        {
            return await _context.PaymComputations.ToListAsync();
        }

        // GET: api/PaymComputations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymComputation>> GetPaymComputation(int id)
        {
            var paymComputation = await _context.PaymComputations.FindAsync(id);

            if (paymComputation == null)
            {
                return NotFound();
            }

            return paymComputation;
        }

        // PUT: api/PaymComputations/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymComputation(int id, PaymComputation paymComputation)
        {
            if (id != paymComputation.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(paymComputation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymComputationExists(id))
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

        // POST: api/PaymComputations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymComputation>> PostPaymComputation(PaymComputation paymComputation)
        {
            _context.PaymComputations.Add(paymComputation);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PaymComputationExists(paymComputation.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPaymComputation", new { id = paymComputation.PnCompanyId }, paymComputation);
        }

        // DELETE: api/PaymComputations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymComputation(int id)
        {
            var paymComputation = await _context.PaymComputations.FindAsync(id);
            if (paymComputation == null)
            {
                return NotFound();
            }

            _context.PaymComputations.Remove(paymComputation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymComputationExists(int id)
        {
            return _context.PaymComputations.Any(e => e.PnCompanyId == id);
        }
    }
}
