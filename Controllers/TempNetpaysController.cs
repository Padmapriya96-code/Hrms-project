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
    public class TempNetpaysController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public TempNetpaysController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/TempNetpays
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TempNetpay>>> GetTempNetpays()
        {
            return await _context.TempNetpays.ToListAsync();
        }

        // GET: api/TempNetpays/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TempNetpay>> GetTempNetpay(int id)
        {
            var tempNetpay = await _context.TempNetpays.FindAsync(id);

            if (tempNetpay == null)
            {
                return NotFound();
            }

            return tempNetpay;
        }

        // PUT: api/TempNetpays/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTempNetpay(int id, TempNetpay tempNetpay)
        {
            if (id != tempNetpay.Id)
            {
                return BadRequest();
            }

            _context.Entry(tempNetpay).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TempNetpayExists(id))
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

        // POST: api/TempNetpays
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TempNetpay>> PostTempNetpay(TempNetpay tempNetpay)
        {
            _context.TempNetpays.Add(tempNetpay);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTempNetpay", new { id = tempNetpay.Id }, tempNetpay);
        }

        // DELETE: api/TempNetpays/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTempNetpay(int id)
        {
            var tempNetpay = await _context.TempNetpays.FindAsync(id);
            if (tempNetpay == null)
            {
                return NotFound();
            }

            _context.TempNetpays.Remove(tempNetpay);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TempNetpayExists(int id)
        {
            return _context.TempNetpays.Any(e => e.Id == id);
        }
    }
}
