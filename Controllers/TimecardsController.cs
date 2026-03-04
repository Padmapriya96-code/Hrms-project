using Microsoft.AspNetCore.Mvc;
using HRMSAPPLICATION.Models;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
       [AllowAnonymousJwt]

    public class TimecardsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public TimecardsController(HrmsystemContext context)
        {
            _context = context;
        }

        // POST: api/TimeCard
        [HttpPost]
        public async Task<ActionResult<TimeCard>> PostTimeCard(TimeCard timeCard)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.TimeCards.Add(timeCard);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTimeCard), new { id = timeCard.Sno }, timeCard);
        }



        // GET: api/TimeCard/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TimeCard>> GetTimeCard(int id)
        {
            var timeCard = await _context.TimeCards.FindAsync(id);

            if (timeCard == null)
            {
                return NotFound();
            }

            return timeCard;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<TimeCard>>> GetTimeCard()
        {
            return await _context.TimeCards.ToListAsync();
        }

        // PUT: api/TimeCard/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTimeCard(int id, TimeCard timeCard)
        {
            if (id != timeCard.Sno)
            {
                return BadRequest();
            }

            _context.Entry(timeCard).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimeCardExists(id))
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

        // DELETE: api/TimeCard/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TimeCard>> DeleteTimeCard(int id)
        {
            var timeCard = await _context.TimeCards.FindAsync(id);
            if (timeCard == null)
            {
                return NotFound();
            }

            _context.TimeCards.Remove(timeCard);
            await _context.SaveChangesAsync();

            return timeCard;
        }

        private bool TimeCardExists(int id)
        {
            return _context.TimeCards.Any(e => e.Sno == id);
        }
    }
}