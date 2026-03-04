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
    public class PaymEmployeeLeavesController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymEmployeeLeavesController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymEmployeeLeaves
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymEmployeeLeave>>> GetPaymEmployeeLeaves()
        {
            return await _context.PaymEmployeeLeaves.ToListAsync();
        }

        // GET: api/PaymEmployeeLeaves/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymEmployeeLeave>> GetPaymEmployeeLeave(int id)
        {
            var paymEmployeeLeave = await _context.PaymEmployeeLeaves.FindAsync(id);

            if (paymEmployeeLeave == null)
            {
                return NotFound();
            }

            return paymEmployeeLeave;
        }

        // PUT: api/PaymEmployeeLeaves/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymEmployeeLeave(int id, PaymEmployeeLeave paymEmployeeLeave)
        {
            if (id != paymEmployeeLeave.Id)
            {
                return BadRequest();
            }

            _context.Entry(paymEmployeeLeave).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymEmployeeLeaveExists(id))
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

        // POST: api/PaymEmployeeLeaves
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymEmployeeLeave>> PostPaymEmployeeLeave(PaymEmployeeLeave paymEmployeeLeave)
        {
            _context.PaymEmployeeLeaves.Add(paymEmployeeLeave);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaymEmployeeLeave", new { id = paymEmployeeLeave.Id }, paymEmployeeLeave);
        }

        // DELETE: api/PaymEmployeeLeaves/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymEmployeeLeave(int id)
        {
            var paymEmployeeLeave = await _context.PaymEmployeeLeaves.FindAsync(id);
            if (paymEmployeeLeave == null)
            {
                return NotFound();
            }

            _context.PaymEmployeeLeaves.Remove(paymEmployeeLeave);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymEmployeeLeaveExists(int id)
        {
            return _context.PaymEmployeeLeaves.Any(e => e.Id == id);
        }
    }
}
