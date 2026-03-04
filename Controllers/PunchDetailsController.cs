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
    public class PunchDetailsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PunchDetailsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PunchDetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PunchDetail>>> GetPunchDetails()
        {
            return await _context.PunchDetails.ToListAsync();
        }

        // GET: api/PunchDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PunchDetail>> GetPunchDetail(int id)
        {
            var punchDetail = await _context.PunchDetails.FindAsync(id);

            if (punchDetail == null)
            {
                return NotFound();
            }

            return punchDetail;
        }

        // PUT: api/PunchDetails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPunchDetail(int id, PunchDetail punchDetail)
        {
            if (id != punchDetail.Id)
            {
                return BadRequest();
            }

            _context.Entry(punchDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PunchDetailExists(id))
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

        // POST: api/PunchDetails
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PunchDetail>> PostPunchDetail(PunchDetail punchDetail)
        {
            _context.PunchDetails.Add(punchDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPunchDetail", new { id = punchDetail.Id }, punchDetail);
        }

        // DELETE: api/PunchDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePunchDetail(int id)
        {
            var punchDetail = await _context.PunchDetails.FindAsync(id);
            if (punchDetail == null)
            {
                return NotFound();
            }

            _context.PunchDetails.Remove(punchDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PunchDetailExists(int id)
        {
            return _context.PunchDetails.Any(e => e.Id == id);
        }
    }
}
