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
    public class PaymEmpEarningsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymEmpEarningsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymEmpEarnings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymEmpEarning>>> GetPaymEmpEarnings()
        {
            return await _context.PaymEmpEarnings.ToListAsync();
        }

        // GET: api/PaymEmpEarnings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymEmpEarning>> GetPaymEmpEarning(int id)
        {
            var paymEmpEarning = await _context.PaymEmpEarnings.FindAsync(id);

            if (paymEmpEarning == null)
            {
                return NotFound();
            }

            return paymEmpEarning;
        }

        // PUT: api/PaymEmpEarnings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymEmpEarning(int id, PaymEmpEarning paymEmpEarning)
        {
            if (id != paymEmpEarning.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(paymEmpEarning).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymEmpEarningExists(id))
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

        // POST: api/PaymEmpEarnings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymEmpEarning>> PostPaymEmpEarning(PaymEmpEarning paymEmpEarning)
        {
            _context.PaymEmpEarnings.Add(paymEmpEarning);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PaymEmpEarningExists(paymEmpEarning.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPaymEmpEarning", new { id = paymEmpEarning.PnCompanyId }, paymEmpEarning);
        }

        // DELETE: api/PaymEmpEarnings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymEmpEarning(int id)
        {
            var paymEmpEarning = await _context.PaymEmpEarnings.FindAsync(id);
            if (paymEmpEarning == null)
            {
                return NotFound();
            }

            _context.PaymEmpEarnings.Remove(paymEmpEarning);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymEmpEarningExists(int id)
        {
            return _context.PaymEmpEarnings.Any(e => e.PnCompanyId == id);
        }
    }
}
