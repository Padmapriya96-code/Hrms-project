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
    public class PayInputsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PayInputsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PayInputs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PayInput>>> GetPayInputs()
        {
            return await _context.PayInputs.ToListAsync();
        }

        // GET: api/PayInputs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PayInput>> GetPayInput(int id)
        {
            var payInput = await _context.PayInputs.FindAsync(id);

            if (payInput == null)
            {
                return NotFound();
            }

            return payInput;
        }

        // PUT: api/PayInputs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayInput(int id, PayInput payInput)
        {
            if (id != payInput.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(payInput).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PayInputExists(id))
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

        // POST: api/PayInputs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PayInput>> PostPayInput(PayInput payInput)
        {
            _context.PayInputs.Add(payInput);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PayInputExists(payInput.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPayInput", new { id = payInput.PnCompanyId }, payInput);
        }

        // DELETE: api/PayInputs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayInput(int id)
        {
            var payInput = await _context.PayInputs.FindAsync(id);
            if (payInput == null)
            {
                return NotFound();
            }

            _context.PayInputs.Remove(payInput);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PayInputExists(int id)
        {
            return _context.PayInputs.Any(e => e.PnCompanyId == id);
        }
    }
}
