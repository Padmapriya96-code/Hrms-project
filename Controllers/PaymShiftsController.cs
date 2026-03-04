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
    [AllowAnonymousJwt]
    public class PaymShiftsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymShiftsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymShifts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymShift>>> GetPaymShifts()
        {
            return await _context.PaymShifts.ToListAsync();
        }

        // GET: api/PaymShifts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymShift>> GetPaymShift(int id)
        {
            var paymShift = await _context.PaymShifts.FindAsync(id);

            if (paymShift == null)
            {
                return NotFound();
            }

            return paymShift;
        }

        // PUT: api/PaymShifts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymShift(int id, PaymShift paymShift)
        {
            if (id != paymShift.pn_CompanyID)
            {
                return BadRequest();
            }

            _context.Entry(paymShift).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymShiftExists(id))
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

        // POST: api/PaymShifts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymShift>> PostPaymShift(PaymShift paymShift)
        {
            _context.PaymShifts.Add(paymShift);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PaymShiftExists(paymShift.pn_CompanyID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPaymShift", new { id = paymShift.pn_CompanyID }, paymShift);
        }

        // DELETE: api/PaymShifts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymShift(int id)
        {
            var paymShift = await _context.PaymShifts.FindAsync(id);
            if (paymShift == null)
            {
                return NotFound();
            }

            _context.PaymShifts.Remove(paymShift);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymShiftExists(int id)
        {
            return _context.PaymShifts.Any(e => e.pn_CompanyID == id);
        }
    }
}