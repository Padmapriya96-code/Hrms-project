using HRMSAPPLICATION.DTO;
using HRMSAPPLICATION.Infrastructure;
using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymLeavesController : ControllerBase
    {
        private readonly TenantDbContextFactory _factory;
        public PaymLeavesController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }
        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);
        }

        // GET: api/PaymLeaves
        [HttpGet("{companyId}/{branchId?}")]
        public async Task<ActionResult<IEnumerable<PaymLeaveDto>>> GetPaymLeaves(int companyId,int? branchId)
        {
            using var context = GetTenantContext();
            var query =  context.PaymLeaves.Where(l => l.PnCompanyId == companyId);
            if(branchId.HasValue&&branchId.Value!=0)
            {
                query = query.Where(l => l.PnBranchId == branchId.Value);
            }
            return await query.Select(l => new PaymLeaveDto
            {
                PnCompanyId = l.PnCompanyId,
                PnLeaveId=l.PnLeaveId,
                VLeaveName=l.VLeaveName,
                PnLeaveCode=l.PnLeaveCode,
                PnCount=l.PnCount,
                Status=l.Status,
                PnBranchId=l.PnBranchId,
                
                MaxDays=l.MaxDays,
                
                Type=l.Type

            }).ToListAsync();
        }
        //post
        [HttpPost]
        public async Task<IActionResult> CreateLeave(PaymLeaveDto dto)
        {
            using var context = GetTenantContext();
            var leave = new PaymLeave
            {
                PnCompanyId = dto.PnCompanyId,
                VLeaveName = dto.VLeaveName,
                PnLeaveCode = dto.PnLeaveCode,
                PnCount = dto.PnCount,
                Status = dto.Status,
                PnBranchId = dto.PnBranchId,
                
                MaxDays = dto.MaxDays,
                
                Type = dto.Type
                // PnLeaveId is auto-generated
            };
           context.PaymLeaves.Add(leave);
            await context.SaveChangesAsync();
            return Ok(new { message = "Leave created successfully" });

        }
        //put
        [HttpPut]
        public async Task<IActionResult> UpdateLeave(PaymLeaveDto dto)
        {
            using var context = GetTenantContext();
            //find composite key
            var existing = await context.PaymLeaves.FirstOrDefaultAsync(l => l.PnCompanyId == dto.PnCompanyId
            && l.PnLeaveId == dto.PnLeaveId);
            if (existing == null) return NotFound("Leave not found");
            existing.VLeaveName = dto.VLeaveName;
            existing.PnLeaveCode = dto.PnLeaveCode;
            existing.PnCount = dto.PnCount;
            existing.Status = dto.Status;
            existing.PnBranchId = dto.PnBranchId;
            
            existing.MaxDays = dto.MaxDays;
            
            existing.Type = dto.Type;
            await context.SaveChangesAsync();
            return Ok(new { message = "Leave updated successfully" });
        }
        //delete
        [HttpDelete("{companyId}/{leaveId}")]
        public async Task<IActionResult> DeletLeave(int companyId,int leaveId)
        {
            using var context = GetTenantContext();
            var leave = await context.PaymLeaves.FirstOrDefaultAsync(l => l.PnCompanyId == companyId
            && l.PnLeaveId == leaveId);
            if (leave == null) return NotFound();
            context.PaymLeaves.Remove(leave);
            await context.SaveChangesAsync();
            return Ok(new { message = "Leave deleted successfully" });
        }
        
    }
}
