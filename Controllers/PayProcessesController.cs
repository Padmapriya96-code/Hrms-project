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
    public class PayProcessesController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PayProcessesController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PayProcesses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PayProcess>>> GetPayProcesses()
        {
            return await _context.PayProcesses.ToListAsync();
        }

        // GET: api/PayProcesses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PayProcess>> GetPayProcess(int id)
        {
            var payProcess = await _context.PayProcesses.FindAsync(id);

            if (payProcess == null)
            {
                return NotFound();
            }

            return payProcess;
        }

        // PUT: api/PayProcesses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayProcess(int id, PayProcess payProcess)
        {
            if (id != payProcess.Id)
            {
                return BadRequest();
            }

            _context.Entry(payProcess).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PayProcessExists(id))
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

        // POST: api/PayProcesses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PayProcess>> PostPayProcess(PayProcess payProcess)
        {
            _context.PayProcesses.Add(payProcess);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPayProcess", new { id = payProcess.Id }, payProcess);
        }

        // DELETE: api/PayProcesses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayProcess(int id)
        {
            var payProcess = await _context.PayProcesses.FindAsync(id);
            if (payProcess == null)
            {
                return NotFound();
            }

            _context.PayProcesses.Remove(payProcess);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PayProcessExists(int id)
        {
            return _context.PayProcesses.Any(e => e.Id == id);
        }
    }
}
