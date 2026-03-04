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
    public class LoanEntriesController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public LoanEntriesController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/LoanEntries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoanEntry>>> GetLoanEntries()
        {
            return await _context.LoanEntries.ToListAsync();
        }

        // GET: api/LoanEntries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LoanEntry>> GetLoanEntry(string id)
        {
            var loanEntry = await _context.LoanEntries.FindAsync(id);

            if (loanEntry == null)
            {
                return NotFound();
            }

            return loanEntry;
        }

        // PUT: api/LoanEntries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoanEntry(string id, LoanEntry loanEntry)
        {
            if (id != loanEntry.LoanAppid)
            {
                return BadRequest();
            }

            _context.Entry(loanEntry).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoanEntryExists(id))
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

        // POST: api/LoanEntries
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LoanEntry>> PostLoanEntry(LoanEntry loanEntry)
        {
            _context.LoanEntries.Add(loanEntry);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (LoanEntryExists(loanEntry.LoanAppid))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetLoanEntry", new { id = loanEntry.LoanAppid }, loanEntry);
        }

        // DELETE: api/LoanEntries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoanEntry(string id)
        {
            var loanEntry = await _context.LoanEntries.FindAsync(id);
            if (loanEntry == null)
            {
                return NotFound();
            }

            _context.LoanEntries.Remove(loanEntry);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LoanEntryExists(string id)
        {
            return _context.LoanEntries.Any(e => e.LoanAppid == id);
        }
    }
}
