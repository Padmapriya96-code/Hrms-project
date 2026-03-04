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
    public class PaymLeaveAllocation1Controller : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymLeaveAllocation1Controller(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymLeaveAllocation1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymLeaveAllocation1>>> GetPaymLeaveAllocation1s()
        {
            return await _context.PaymLeaveAllocation1s.ToListAsync();
        }

        // GET: api/PaymLeaveAllocation1/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymLeaveAllocation1>> GetPaymLeaveAllocation1(int id)
        {
            var paymLeaveAllocation1 = await _context.PaymLeaveAllocation1s.FindAsync(id);

            if (paymLeaveAllocation1 == null)
            {
                return NotFound();
            }

            return paymLeaveAllocation1;
        }

        // PUT: api/PaymLeaveAllocation1/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymLeaveAllocation1(int id, PaymLeaveAllocation1 paymLeaveAllocation1)
        {
            if (id != paymLeaveAllocation1.PnCompanyid)
            {
                return BadRequest();
            }

            _context.Entry(paymLeaveAllocation1).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymLeaveAllocation1Exists(id))
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

        // POST: api/PaymLeaveAllocation1
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymLeaveAllocation1>> PostPaymLeaveAllocation1(PaymLeaveAllocation1 paymLeaveAllocation1)
        {
            _context.PaymLeaveAllocation1s.Add(paymLeaveAllocation1);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PaymLeaveAllocation1Exists(paymLeaveAllocation1.PnCompanyid))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPaymLeaveAllocation1", new { id = paymLeaveAllocation1.PnCompanyid }, paymLeaveAllocation1);
        }

        // DELETE: api/PaymLeaveAllocation1/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymLeaveAllocation1(int id)
        {
            var paymLeaveAllocation1 = await _context.PaymLeaveAllocation1s.FindAsync(id);
            if (paymLeaveAllocation1 == null)
            {
                return NotFound();
            }

            _context.PaymLeaveAllocation1s.Remove(paymLeaveAllocation1);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymLeaveAllocation1Exists(int id)
        {
            return _context.PaymLeaveAllocation1s.Any(e => e.PnCompanyid == id);
        }
    }
}
