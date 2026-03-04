using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveApproveManagerController : ControllerBase
    {

        private readonly HrmsystemContext _context;

        public LeaveApproveManagerController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/LeaveApproveManager
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeaveapproveManager>>> GetLeaveApproveManager()
        {
            return await _context.LeaveapproveManagers.ToListAsync();
        }

        // GET: api/LeaveapproveHrs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LeaveapproveManager>> GetLeaveApproveManager(int id)
        {
            var leaveapproveManager = await _context.LeaveapproveManagers.FindAsync(id);

            if (leaveapproveManager == null)
            {
                return NotFound();
            }

            return leaveapproveManager;
        }

        // PUT: api/LeaveapproveManagers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLeaveApproveManager(int id, LeaveapproveManager leaveapproveManager)
        {
            if (id != leaveapproveManager.Sno)
            {
                return BadRequest();
            }

            _context.Entry(leaveapproveManager).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeaveapproveManagerExists(id))
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

        // POST: api/LeaveapproveManagers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LeaveapproveHr>> PostLeaveapproveManager(LeaveapproveManager leaveapproveManager)
        {
            _context.LeaveapproveManagers.Add(leaveapproveManager);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLeaveapproveManager", new { id = leaveapproveManager.Sno }, leaveapproveManager);
        }

        // DELETE: api/LeaveapproveManagers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveapproveManager(int id)
        {
            var leaveapproveManager = await _context.LeaveapproveHrs.FindAsync(id);
            if (leaveapproveManager == null)
            {
                return NotFound();
            }

            _context.LeaveapproveHrs.Remove(leaveapproveManager);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LeaveapproveManagerExists(int id)
        {
            return _context.LeaveapproveHrs.Any(e => e.Sno == id);
        }

    }
}
