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
    public class PaymCarryForwardsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymCarryForwardsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymCarryForwards
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymCarryForward>>> GetPaymCarryForwards()
        {
            return await _context.PaymCarryForwards.ToListAsync();
        }

        // GET: api/PaymCarryForwards/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymCarryForward>> GetPaymCarryForward(int id)
        {
            var paymCarryForward = await _context.PaymCarryForwards.FindAsync(id);

            if (paymCarryForward == null)
            {
                return NotFound();
            }

            return paymCarryForward;
        }

        // PUT: api/PaymCarryForwards/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymCarryForward(int id, PaymCarryForward paymCarryForward)
        {
            if (id != paymCarryForward.Id)
            {
                return BadRequest();
            }

            _context.Entry(paymCarryForward).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymCarryForwardExists(id))
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

        // POST: api/PaymCarryForwards
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymCarryForward>> PostPaymCarryForward(PaymCarryForward paymCarryForward)
        {
            _context.PaymCarryForwards.Add(paymCarryForward);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaymCarryForward", new { id = paymCarryForward.Id }, paymCarryForward);
        }

        // DELETE: api/PaymCarryForwards/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymCarryForward(int id)
        {
            var paymCarryForward = await _context.PaymCarryForwards.FindAsync(id);
            if (paymCarryForward == null)
            {
                return NotFound();
            }

            _context.PaymCarryForwards.Remove(paymCarryForward);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymCarryForwardExists(int id)
        {
            return _context.PaymCarryForwards.Any(e => e.Id == id);
        }
    }
}
