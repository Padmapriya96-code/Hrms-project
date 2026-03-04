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
    public class PaymVpfsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymVpfsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymVpfs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymVpf>>> GetPaymVpfs()
        {
            return await _context.PaymVpfs.ToListAsync();
        }

        // GET: api/PaymVpfs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymVpf>> GetPaymVpf(int id)
        {
            var paymVpf = await _context.PaymVpfs.FindAsync(id);

            if (paymVpf == null)
            {
                return NotFound();
            }

            return paymVpf;
        }

        // PUT: api/PaymVpfs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymVpf(int id, PaymVpf paymVpf)
        {
            if (id != paymVpf.Id)
            {
                return BadRequest();
            }

            _context.Entry(paymVpf).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymVpfExists(id))
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

        // POST: api/PaymVpfs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymVpf>> PostPaymVpf(PaymVpf paymVpf)
        {
            _context.PaymVpfs.Add(paymVpf);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaymVpf", new { id = paymVpf.Id }, paymVpf);
        }

        // DELETE: api/PaymVpfs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymVpf(int id)
        {
            var paymVpf = await _context.PaymVpfs.FindAsync(id);
            if (paymVpf == null)
            {
                return NotFound();
            }

            _context.PaymVpfs.Remove(paymVpf);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymVpfExists(int id)
        {
            return _context.PaymVpfs.Any(e => e.Id == id);
        }
    }
}
