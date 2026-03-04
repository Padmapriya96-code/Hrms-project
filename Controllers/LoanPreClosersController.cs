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
    public class LoanPreClosersController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public LoanPreClosersController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/LoanPreClosers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoanPreCloser>>> GetLoanPreClosers()
        {
            return await _context.LoanPreClosers.ToListAsync();
        }

        // GET: api/LoanPreClosers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LoanPreCloser>> GetLoanPreCloser(string id)
        {
            var loanPreCloser = await _context.LoanPreClosers.FindAsync(id);

            if (loanPreCloser == null)
            {
                return NotFound();
            }

            return loanPreCloser;
        }

        // PUT: api/LoanPreClosers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoanPreCloser(string id, LoanPreCloser loanPreCloser)
        {
            if (id != loanPreCloser.LoanAppid)
            {
                return BadRequest();
            }

            _context.Entry(loanPreCloser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoanPreCloserExists(id))
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

        // POST: api/LoanPreClosers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LoanPreCloser>> PostLoanPreCloser(LoanPreCloser loanPreCloser)
        {
            _context.LoanPreClosers.Add(loanPreCloser);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (LoanPreCloserExists(loanPreCloser.LoanAppid))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetLoanPreCloser", new { id = loanPreCloser.LoanAppid }, loanPreCloser);
        }

        // DELETE: api/LoanPreClosers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoanPreCloser(string id)
        {
            var loanPreCloser = await _context.LoanPreClosers.FindAsync(id);
            if (loanPreCloser == null)
            {
                return NotFound();
            }

            _context.LoanPreClosers.Remove(loanPreCloser);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LoanPreCloserExists(string id)
        {
            return _context.LoanPreClosers.Any(e => e.LoanAppid == id);
        }
    }
}
