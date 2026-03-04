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
    public class DailyTimecardNewsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public DailyTimecardNewsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/DailyTimecardNews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DailyTimecardNew>>> GetDailyTimecardNews()
        {
            return await _context.DailyTimecardNews.ToListAsync();
        }

        // GET: api/DailyTimecardNews/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DailyTimecardNew>> GetDailyTimecardNew(int id)
        {
            var dailyTimecardNew = await _context.DailyTimecardNews.FindAsync(id);

            if (dailyTimecardNew == null)
            {
                return NotFound();
            }

            return dailyTimecardNew;
        }

        // PUT: api/DailyTimecardNews/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDailyTimecardNew(int id, DailyTimecardNew dailyTimecardNew)
        {
            if (id != dailyTimecardNew.Id)
            {
                return BadRequest();
            }

            _context.Entry(dailyTimecardNew).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DailyTimecardNewExists(id))
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

        // POST: api/DailyTimecardNews
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DailyTimecardNew>> PostDailyTimecardNew(DailyTimecardNew dailyTimecardNew)
        {
            _context.DailyTimecardNews.Add(dailyTimecardNew);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDailyTimecardNew", new { id = dailyTimecardNew.Id }, dailyTimecardNew);
        }

        // DELETE: api/DailyTimecardNews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDailyTimecardNew(int id)
        {
            var dailyTimecardNew = await _context.DailyTimecardNews.FindAsync(id);
            if (dailyTimecardNew == null)
            {
                return NotFound();
            }

            _context.DailyTimecardNews.Remove(dailyTimecardNew);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DailyTimecardNewExists(int id)
        {
            return _context.DailyTimecardNews.Any(e => e.Id == id);
        }
    }
}
