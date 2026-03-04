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
using HRMSAPPLICATION.DTO;
using TraceReloggerLib;
using HRMSAPPLICATION.Infrastructure;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymLevelsController : ControllerBase
    {
        private readonly TenantDbContextFactory _factory;

        public PaymLevelsController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }
        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);
        }

        // GET: api/PaymLevels
        [HttpGet("{companyId}/{branchId?}")]
        public async Task<ActionResult<IEnumerable<PaymLevelDto>>> GetPaymLevels(int companyId,int?branchId)
        {
            using var context = GetTenantContext();
            var query = context.PaymLevels.Where(l => l.PnCompanyId == companyId);
            if (branchId.HasValue && branchId != 0)
            {
                query = query.Where(l => branchId == branchId.Value);
            }
            return await query.Select(l => new PaymLevelDto
            {
                PnCompanyId=l.PnCompanyId,
                BranchId=l.BranchId,
                PnLevelId=l.PnLevelId,
                VLevelName=l.VLevelName,
                Status=l.Status

            }).ToListAsync();
        }

       
        [HttpPost]
        public async Task<ActionResult> CreateLevel(PaymLevelDto dto)
        {
            using var context = GetTenantContext();
            //check if the triple composite key already exists
            var exists = await context.PaymLevels.AnyAsync(l =>
            l.PnCompanyId == dto.PnCompanyId &&
            l.BranchId == dto.BranchId &&
            l.VLevelName == dto.VLevelName);
            if (exists) return BadRequest("Level name already exists");
            var level = new PaymLevel
            {
                PnCompanyId = dto.PnCompanyId,
                BranchId = dto.BranchId,
                VLevelName = dto.VLevelName,
                Status = dto.Status
                //PnLevelid is identity,so no need to set it
            };
            context.PaymLevels.Add(level);
            await context.SaveChangesAsync();
            return Ok(new { message = "Level created successfully" });

        }

        
        [HttpPut]
        public async Task<IActionResult> UpdateLevel(PaymLevelDto dto)
        {
            using var context = GetTenantContext();
            //Find the triple comosite key
            var existing = await context.PaymLevels.FirstOrDefaultAsync(l =>
            l.PnCompanyId == dto.PnCompanyId &&
            l.BranchId == dto.BranchId &&
            l.VLevelName == dto.VLevelName);
            if (existing == null) return NotFound("Level not found");
            existing.Status = dto.Status;
                //note:VLevelName cannot be changed here as it is part of the Primary key
                await context.SaveChangesAsync();
            return Ok(new { message = "LEvel updated successfully" });


        }

        [HttpDelete("{companyId}/{branchId}/{levelName}")]
        public async Task<IActionResult> DeleteLevel(int companyId,int branchId
            ,string levelName)
        {
            using var context = GetTenantContext();

            var level = await context.PaymLevels.FirstOrDefaultAsync(l =>
            l.PnCompanyId == companyId &&
            l.BranchId == branchId &&
            l.VLevelName == levelName);
            if (level == null) return NotFound();
            context.PaymLevels.Remove(level);
            await context.SaveChangesAsync();
            return Ok(new { message = "Level deleted successfully" });
        }

        
    }
}
