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
    public class PaymEmployeeWorkDetailsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymEmployeeWorkDetailsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymEmployeeWorkDetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymEmployeeWorkDetail>>> GetPaymEmployeeWorkDetails()
        {
            return await _context.PaymEmployeeWorkDetails.ToListAsync();
        }

        // GET: api/PaymEmployeeWorkDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymEmployeeWorkDetail>> GetPaymEmployeeWorkDetail(int id)
        {
            var paymEmployeeWorkDetail = await _context.PaymEmployeeWorkDetails.FindAsync(id);

            if (paymEmployeeWorkDetail == null)
            {
                return NotFound();
            }

            return paymEmployeeWorkDetail;
        }

        // PUT: api/PaymEmployeeWorkDetails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymEmployeeWorkDetail(int id, PaymEmployeeWorkDetail paymEmployeeWorkDetail)
        {
            if (id != paymEmployeeWorkDetail.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(paymEmployeeWorkDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymEmployeeWorkDetailExists(id))
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

        // POST: api/PaymEmployeeWorkDetails
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymEmployeeWorkDetail>> PostPaymEmployeeWorkDetail(PaymEmployeeWorkDetail paymEmployeeWorkDetail)
        {
            _context.PaymEmployeeWorkDetails.Add(paymEmployeeWorkDetail);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PaymEmployeeWorkDetailExists(paymEmployeeWorkDetail.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPaymEmployeeWorkDetail", new { id = paymEmployeeWorkDetail.PnCompanyId }, paymEmployeeWorkDetail);
        }

        // DELETE: api/PaymEmployeeWorkDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymEmployeeWorkDetail(int id)
        {
            var paymEmployeeWorkDetail = await _context.PaymEmployeeWorkDetails.FindAsync(id);
            if (paymEmployeeWorkDetail == null)
            {
                return NotFound();
            }

            _context.PaymEmployeeWorkDetails.Remove(paymEmployeeWorkDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymEmployeeWorkDetailExists(int id)
        {
            return _context.PaymEmployeeWorkDetails.Any(e => e.PnCompanyId == id);
        }
    }
}
