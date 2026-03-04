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
    public class Form7Controller : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public Form7Controller(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/Form7
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Form7>>> GetForm7s()
        {
            return await _context.Form7s.ToListAsync();
        }

        // GET: api/Form7/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Form7>> GetForm7(int id)
        {
            var form7 = await _context.Form7s.FindAsync(id);

            if (form7 == null)
            {
                return NotFound();
            }

            return form7;
        }

        // PUT: api/Form7/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutForm7(int id, Form7 form7)
        {
            if (id != form7.Id)
            {
                return BadRequest();
            }

            _context.Entry(form7).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Form7Exists(id))
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

        // POST: api/Form7
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Form7>> PostForm7(Form7 form7)
        {
            _context.Form7s.Add(form7);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetForm7", new { id = form7.Id }, form7);
        }

        // DELETE: api/Form7/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteForm7(int id)
        {
            var form7 = await _context.Form7s.FindAsync(id);
            if (form7 == null)
            {
                return NotFound();
            }

            _context.Form7s.Remove(form7);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool Form7Exists(int id)
        {
            return _context.Form7s.Any(e => e.Id == id);
        }
    }
}
