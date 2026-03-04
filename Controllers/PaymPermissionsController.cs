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
    public class PaymPermissionsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymPermissionsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymPermissions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymPermission>>> GetPaymPermissions()
        {
            return await _context.PaymPermissions.ToListAsync();
        }

        // GET: api/PaymPermissions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymPermission>> GetPaymPermission(int id)
        {
            var paymPermission = await _context.PaymPermissions.FindAsync(id);

            if (paymPermission == null)
            {
                return NotFound();
            }

            return paymPermission;
        }

        // PUT: api/PaymPermissions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymPermission(int id, PaymPermission paymPermission)
        {
            if (id != paymPermission.CompanyId)
            {
                return BadRequest();
            }

            _context.Entry(paymPermission).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymPermissionExists(id))
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

        // POST: api/PaymPermissions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymPermission>> PostPaymPermission(PaymPermission paymPermission)
        {
            _context.PaymPermissions.Add(paymPermission);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PaymPermissionExists(paymPermission.CompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPaymPermission", new { id = paymPermission.CompanyId }, paymPermission);
        }

        // DELETE: api/PaymPermissions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymPermission(int id)
        {
            var paymPermission = await _context.PaymPermissions.FindAsync(id);
            if (paymPermission == null)
            {
                return NotFound();
            }

            _context.PaymPermissions.Remove(paymPermission);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymPermissionExists(int id)
        {
            return _context.PaymPermissions.Any(e => e.CompanyId == id);
        }
    }
}
