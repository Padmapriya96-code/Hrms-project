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
    public class PaymHolidaysController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymHolidaysController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymHolidays
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymHoliday>>> GetPaymHolidays()
        {
            return await _context.PaymHolidays.ToListAsync();
        }

        // GET: api/PaymHolidays/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymHoliday>> GetPaymHoliday(int id)
        {
            var paymHoliday = await _context.PaymHolidays.FindAsync(id);

            if (paymHoliday == null)
            {
                return NotFound();
            }

            return paymHoliday;
        }

        // PUT: api/PaymHolidays/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymHoliday(int id, PaymHoliday paymHoliday)
        {
            if (id != paymHoliday.Id)
            {
                return BadRequest();
            }

            _context.Entry(paymHoliday).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymHolidayExists(id))
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

        // POST: api/PaymHolidays
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymHoliday>> PostPaymHoliday(PaymHoliday paymHoliday)
        {
            _context.PaymHolidays.Add(paymHoliday);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaymHoliday", new { id = paymHoliday.Id }, paymHoliday);
        }

        // DELETE: api/PaymHolidays/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymHoliday(int id)
        {
            var paymHoliday = await _context.PaymHolidays.FindAsync(id);
            if (paymHoliday == null)
            {
                return NotFound();
            }

            _context.PaymHolidays.Remove(paymHoliday);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymHolidayExists(int id)
        {
            return _context.PaymHolidays.Any(e => e.Id == id);
        }
    }
}
