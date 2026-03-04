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
    public class TempDeductionsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public TempDeductionsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/TempDeductions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TempDeduction>>> GetTempDeductions()
        {
            return await _context.TempDeductions.ToListAsync();
        }

        // GET: api/TempDeductions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TempDeduction>> GetTempDeduction(int id)
        {
            var tempDeduction = await _context.TempDeductions.FindAsync(id);

            if (tempDeduction == null)
            {
                return NotFound();
            }

            return tempDeduction;
        }

        // PUT: api/TempDeductions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTempDeduction(int id, TempDeduction tempDeduction)
        {
            if (id != tempDeduction.Id)
            {
                return BadRequest();
            }

            _context.Entry(tempDeduction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TempDeductionExists(id))
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

        // POST: api/TempDeductions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TempDeduction>> PostTempDeduction(TempDeduction tempDeduction)
        {
            _context.TempDeductions.Add(tempDeduction);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTempDeduction", new { id = tempDeduction.Id }, tempDeduction);
        }

        // DELETE: api/TempDeductions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTempDeduction(int id)
        {
            var tempDeduction = await _context.TempDeductions.FindAsync(id);
            if (tempDeduction == null)
            {
                return NotFound();
            }

            _context.TempDeductions.Remove(tempDeduction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TempDeductionExists(int id)
        {
            return _context.TempDeductions.Any(e => e.Id == id);
        }
    }
}
