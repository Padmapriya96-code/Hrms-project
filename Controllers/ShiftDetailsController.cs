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
    [AllowAnonymousJwt]
    public class ShiftDetailsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public ShiftDetailsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/ShiftDetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShiftDetail>>> GetShiftDetails()
        {
            return await _context.ShiftDetails.ToListAsync();
        }

        // GET: api/ShiftDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShiftDetail>> GetShiftDetail(int id)
        {
            var shiftDetail = await _context.ShiftDetails.FindAsync(id);

            if (shiftDetail == null)
            {
                return NotFound();
            }

            return shiftDetail;
        }

        // PUT: api/ShiftDetails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShiftDetail(int id, ShiftDetail shiftDetail)
        {
            if (id != shiftDetail.PnCompanyid)
            {
                return BadRequest();
            }

            _context.Entry(shiftDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShiftDetailExists(id))
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

        // POST: api/ShiftDetails
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ShiftDetail>> PostShiftDetail(ShiftDetail shiftDetail)
        {
            _context.ShiftDetails.Add(shiftDetail);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ShiftDetailExists(shiftDetail.PnCompanyid))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetShiftDetail", new { id = shiftDetail.PnCompanyid }, shiftDetail);
        }

        // DELETE: api/ShiftDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShiftDetail(int id)
        {
            var shiftDetail = await _context.ShiftDetails.FindAsync(id);
            if (shiftDetail == null)
            {
                return NotFound();
            }

            _context.ShiftDetails.Remove(shiftDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShiftDetailExists(int id)
        {
            return _context.ShiftDetails.Any(e => e.PnCompanyid == id);
        }
    }
}
