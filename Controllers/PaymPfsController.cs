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
    public class PaymPfsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymPfsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymPfs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymPf>>> GetPaymPfs()
        {
            return await _context.PaymPfs.ToListAsync();
        }

        // GET: api/PaymPfs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymPf>> GetPaymPf(int id)
        {
            var paymPf = await _context.PaymPfs.FindAsync(id);

            if (paymPf == null)
            {
                return NotFound();
            }

            return paymPf;
        }

        // PUT: api/PaymPfs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymPf(int id, PaymPf paymPf)
        {
            if (id != paymPf.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(paymPf).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymPfExists(id))
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

        // POST: api/PaymPfs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymPf>> PostPaymPf(PaymPf paymPf)
        {
            _context.PaymPfs.Add(paymPf);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PaymPfExists(paymPf.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPaymPf", new { id = paymPf.PnCompanyId }, paymPf);
        }

        // DELETE: api/PaymPfs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymPf(int id)
        {
            var paymPf = await _context.PaymPfs.FindAsync(id);
            if (paymPf == null)
            {
                return NotFound();
            }

            _context.PaymPfs.Remove(paymPf);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymPfExists(int id)
        {
            return _context.PaymPfs.Any(e => e.PnCompanyId == id);
        }
    }
}
