using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;
using HRMSAPPLICATION.Infrastructure;
using HRMSAPPLICATION.Controllers;
using NuGet.Protocol.Plugins;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.CodeAnalysis.Operations;
using System.ComponentModel.Design;
using HRMSAPPLICATION.DTO;

namespace HRMSAPPLICATION.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    
    public class PaymBranchesController : ControllerBase
    {
        private readonly TenantDbContextFactory _factory;
        private readonly MasterDbContext _masterContext;
        public PaymBranchesController(TenantDbContextFactory factory ,MasterDbContext masterContext)
        {
            _factory = factory;
            _masterContext = masterContext;
        }
        private HrmsystemContext GetTenantContext()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                throw new UnauthorizedAccessException("User is not authenticated.");

            var dbName = User.FindFirst("DbName")?.Value;
            if (string.IsNullOrEmpty(dbName))
                throw new UnauthorizedAccessException("DbName claim missing in token.");

            return _factory.CreateFromUser(User);

        }
        //Get:api/PaymBranches
        [HttpGet]
        public async Task<IActionResult> GetPaymBranches()
        {
            using var context = GetTenantContext();
            var branches = await context.PaymBranches.ToListAsync();
            return Ok(branches);
        }
        //get:api/Paymbranches/5
        [HttpGet("by-company/{companyId}")]
        public async Task<IActionResult> GetBranchesByCompany(int companyId)
        {
            try
            {
                using var context = GetTenantContext();
                var companyUserId = User.FindFirst("CompanyUserId")?.Value;
                if (string.IsNullOrEmpty(companyUserId))
                    return Unauthorized("CompanyUserId missing in token");
                var branches = await context.PaymBranches
                    .Where(b => b.PnCompanyId == companyId) // adjust column name
                    .ToListAsync();

                return Ok(branches);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //Post:api/Paymbranches
        [HttpPost]
        public async Task<IActionResult> CreatePaymBranch([FromBody] PaymBranch model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            using var context = GetTenantContext();
            await context.PaymBranches.AddAsync(model);
            await context.SaveChangesAsync();
            return Ok(new { message = "Branch created successfully" });
        }
        //put:api/PaymBranches/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePaymBranch(int id, PaymBranch model)
        {
            using var context = GetTenantContext();

            var branch = await context.PaymBranches.FindAsync(model.PnCompanyId, id);
            // 2.If 'branch' is null, the record doesn't exist. No need for .AnyAsync()
    if (branch == null)
            {
                return NotFound(new { message = $"Branch ID {id} not found for Company {model.PnCompanyId}" });
            }
            try
            {
               
                context.Entry(branch).CurrentValues.SetValues(model);

                await context.SaveChangesAsync();

                return Ok(new { message = "Branch updated successfully" });
            }
            catch (Exception ex)
            {
                // This ensures the frontend gets a readable error message
                var innerMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { error = innerMsg });
            }
        }

        
        [HttpDelete("{companyId:int}/{branchId}")]
        public async Task<IActionResult> DeletePaymBranch(int companyId,int branchId)
        {
            using var tenantContext = GetTenantContext();
            var companyUserId = User.FindFirst("CompanyUserId")?.Value;
            if (string.IsNullOrEmpty(companyUserId))
                return Unauthorized();
            // 1️⃣ Get branch from tenant DB
            // ✅ Composite key handled correctly
            var branch = await tenantContext.PaymBranches
                .FirstOrDefaultAsync(b =>
                    b.PnCompanyId == companyId &&
                    b.PnBranchId == branchId);
            if (branch == null)
                return NotFound();

            var branchUserId = branch.BranchUserId;

            // 2️⃣ Delete from tenant DB
            tenantContext.PaymBranches.Remove(branch);
            await tenantContext.SaveChangesAsync();

            // 3️⃣ Delete from Master DB (if exists)
            if (!string.IsNullOrWhiteSpace(branchUserId))
            {
                var login = await _masterContext.branchLogins
                    .FirstOrDefaultAsync(x => x.BranchUserId == branchUserId);

                if (login != null)
                {
                    _masterContext.branchLogins.Remove(login);
                    await _masterContext.SaveChangesAsync();
                }
            }

            return Ok(new { message = "Branch deleted successfully" });
        }


        [HttpPut("{branchId:int}/designation-access")]
        public async Task<IActionResult> UpdateDesignationAccess(int branchId, [FromBody] AccessUpdateDto dto)
        {
            using var context = GetTenantContext();


            var branch = await context.PaymBranches
                .FirstOrDefaultAsync(b => b.PnBranchId == branchId);
            if (branch == null)
                return NotFound();

            branch.CanManageDesignation = dto.Value;
            await context.SaveChangesAsync();

            return Ok(new { message = "Designation access updated" });
        }

        [HttpPut("{branchId:int}/department-access")]
        public async Task<IActionResult> UpdateDepartmentAccess(int branchId, [FromBody] AccessUpdateDto dto)
        {
            using var context = GetTenantContext();

            var branch = await context.PaymBranches
                .FirstOrDefaultAsync(b => b.PnBranchId == branchId);

            if (branch == null)
                return NotFound();

            branch.CanManageDepartment = dto.Value; 
            await context.SaveChangesAsync();

            return Ok(new { message = "Department access updated" });
        }



    }
}