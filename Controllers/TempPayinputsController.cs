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
    public class TempPayinputsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public TempPayinputsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/TempPayinputs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TempPayinput>>> GetTempPayinputs()
        {
            return await _context.TempPayinputs.ToListAsync();
        }

        // GET: api/TempPayinputs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TempPayinput>> GetTempPayinput(int id)
        {
            var tempPayinput = await _context.TempPayinputs.FindAsync(id);

            if (tempPayinput == null)
            {
                return NotFound();
            }

            return tempPayinput;
        }

        // PUT: api/TempPayinputs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTempPayinput(int id, TempPayinput tempPayinput)
        {
            if (id != tempPayinput.Id)
            {
                return BadRequest();
            }

            _context.Entry(tempPayinput).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TempPayinputExists(id))
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

        // POST: api/TempPayinputs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TempPayinput>> PostTempPayinput(TempPayinput tempPayinput)
        {
            _context.TempPayinputs.Add(tempPayinput);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTempPayinput", new { id = tempPayinput.Id }, tempPayinput);
        }

        // DELETE: api/TempPayinputs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTempPayinput(int id)
        {
            var tempPayinput = await _context.TempPayinputs.FindAsync(id);
            if (tempPayinput == null)
            {
                return NotFound();
            }

            _context.TempPayinputs.Remove(tempPayinput);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TempPayinputExists(int id)
        {
            return _context.TempPayinputs.Any(e => e.Id == id);
        }
    }
}
