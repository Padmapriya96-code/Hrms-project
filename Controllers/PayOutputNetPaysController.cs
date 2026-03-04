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
    public class PayOutputNetPaysController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PayOutputNetPaysController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PayOutputNetPays
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PayOutputNetPay>>> GetPayOutputNetPays()
        {
            return await _context.PayOutputNetPays.ToListAsync();
        }

        // GET: api/PayOutputNetPays/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PayOutputNetPay>> GetPayOutputNetPay(int id)
        {
            var payOutputNetPay = await _context.PayOutputNetPays.FindAsync(id);

            if (payOutputNetPay == null)
            {
                return NotFound();
            }

            return payOutputNetPay;
        }

        // PUT: api/PayOutputNetPays/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayOutputNetPay(int id, PayOutputNetPay payOutputNetPay)
        {
            if (id != payOutputNetPay.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(payOutputNetPay).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PayOutputNetPayExists(id))
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

        // POST: api/PayOutputNetPays
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PayOutputNetPay>> PostPayOutputNetPay(PayOutputNetPay payOutputNetPay)
        {
            _context.PayOutputNetPays.Add(payOutputNetPay);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PayOutputNetPayExists(payOutputNetPay.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPayOutputNetPay", new { id = payOutputNetPay.PnCompanyId }, payOutputNetPay);
        }

        // DELETE: api/PayOutputNetPays/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayOutputNetPay(int id)
        {
            var payOutputNetPay = await _context.PayOutputNetPays.FindAsync(id);
            if (payOutputNetPay == null)
            {
                return NotFound();
            }

            _context.PayOutputNetPays.Remove(payOutputNetPay);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PayOutputNetPayExists(int id)
        {
            return _context.PayOutputNetPays.Any(e => e.PnCompanyId == id);
        }
    }
}
