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
    public class PaymEncashmentDetailsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymEncashmentDetailsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymEncashmentDetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymEncashmentDetail>>> GetPaymEncashmentDetails()
        {
            return await _context.PaymEncashmentDetails.ToListAsync();
        }

        // GET: api/PaymEncashmentDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymEncashmentDetail>> GetPaymEncashmentDetail(int id)
        {
            var paymEncashmentDetail = await _context.PaymEncashmentDetails.FindAsync(id);

            if (paymEncashmentDetail == null)
            {
                return NotFound();
            }

            return paymEncashmentDetail;
        }

        // PUT: api/PaymEncashmentDetails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymEncashmentDetail(int id, PaymEncashmentDetail paymEncashmentDetail)
        {
            if (id != paymEncashmentDetail.Id)
            {
                return BadRequest();
            }

            _context.Entry(paymEncashmentDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymEncashmentDetailExists(id))
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

        // POST: api/PaymEncashmentDetails
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymEncashmentDetail>> PostPaymEncashmentDetail(PaymEncashmentDetail paymEncashmentDetail)
        {
            _context.PaymEncashmentDetails.Add(paymEncashmentDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaymEncashmentDetail", new { id = paymEncashmentDetail.Id }, paymEncashmentDetail);
        }

        // DELETE: api/PaymEncashmentDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymEncashmentDetail(int id)
        {
            var paymEncashmentDetail = await _context.PaymEncashmentDetails.FindAsync(id);
            if (paymEncashmentDetail == null)
            {
                return NotFound();
            }

            _context.PaymEncashmentDetails.Remove(paymEncashmentDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymEncashmentDetailExists(int id)
        {
            return _context.PaymEncashmentDetails.Any(e => e.Id == id);
        }
    }
}
