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
    public class PaymOverHeadingCostsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymOverHeadingCostsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymOverHeadingCosts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymOverHeadingCost>>> GetPaymOverHeadingCosts()
        {
            return await _context.PaymOverHeadingCosts.ToListAsync();
        }

        // GET: api/PaymOverHeadingCosts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymOverHeadingCost>> GetPaymOverHeadingCost(int id)
        {
            var paymOverHeadingCost = await _context.PaymOverHeadingCosts.FindAsync(id);

            if (paymOverHeadingCost == null)
            {
                return NotFound();
            }

            return paymOverHeadingCost;
        }

        // PUT: api/PaymOverHeadingCosts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymOverHeadingCost(int id, PaymOverHeadingCost paymOverHeadingCost)
        {
            if (id != paymOverHeadingCost.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(paymOverHeadingCost).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymOverHeadingCostExists(id))
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

        // POST: api/PaymOverHeadingCosts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymOverHeadingCost>> PostPaymOverHeadingCost(PaymOverHeadingCost paymOverHeadingCost)
        {
            _context.PaymOverHeadingCosts.Add(paymOverHeadingCost);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PaymOverHeadingCostExists(paymOverHeadingCost.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPaymOverHeadingCost", new { id = paymOverHeadingCost.PnCompanyId }, paymOverHeadingCost);
        }

        // DELETE: api/PaymOverHeadingCosts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymOverHeadingCost(int id)
        {
            var paymOverHeadingCost = await _context.PaymOverHeadingCosts.FindAsync(id);
            if (paymOverHeadingCost == null)
            {
                return NotFound();
            }

            _context.PaymOverHeadingCosts.Remove(paymOverHeadingCost);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymOverHeadingCostExists(int id)
        {
            return _context.PaymOverHeadingCosts.Any(e => e.PnCompanyId == id);
        }
    }
}
