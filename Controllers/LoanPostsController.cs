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
    public class LoanPostsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public LoanPostsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/LoanPosts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoanPost>>> GetLoanPosts()
        {
            return await _context.LoanPosts.ToListAsync();
        }

        // GET: api/LoanPosts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LoanPost>> GetLoanPost(string id)
        {
            var loanPost = await _context.LoanPosts.FindAsync(id);

            if (loanPost == null)
            {
                return NotFound();
            }

            return loanPost;
        }

        // PUT: api/LoanPosts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoanPost(string id, LoanPost loanPost)
        {
            if (id != loanPost.LoanReqno)
            {
                return BadRequest();
            }

            _context.Entry(loanPost).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoanPostExists(id))
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

        // POST: api/LoanPosts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LoanPost>> PostLoanPost(LoanPost loanPost)
        {
            _context.LoanPosts.Add(loanPost);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (LoanPostExists(loanPost.LoanReqno))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetLoanPost", new { id = loanPost.LoanReqno }, loanPost);
        }

        // DELETE: api/LoanPosts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoanPost(string id)
        {
            var loanPost = await _context.LoanPosts.FindAsync(id);
            if (loanPost == null)
            {
                return NotFound();
            }

            _context.LoanPosts.Remove(loanPost);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LoanPostExists(string id)
        {
            return _context.LoanPosts.Any(e => e.LoanReqno == id);
        }
    }
}
