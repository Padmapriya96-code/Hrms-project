using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;
using HRMSAPPLICATION.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using HRMSAPPLICATION.DTO;
namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymCategoriesController : ControllerBase
    {
        private readonly TenantDbContextFactory _factory;

        public PaymCategoriesController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }

        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);
        }

        // GET: api/PaymCategories
        [HttpPost("bulk-save")]
        public async Task<IActionResult> BulkSave([FromBody] List<PaymCategoryDto> categoryDtos)
        {
            if (categoryDtos == null || !categoryDtos.Any())
                return BadRequest("Nodata privided");
            using var context=GetTenantContext();
            //map dtos to entities
            var newCategories = categoryDtos.Select(dto => new PaymCategory
            {
                PnCompanyId = dto.PnCompanyId,
                // Parse the string BranchId to int here for the Database Entity
                BranchId = int.Parse(dto.BranchId),
                VCategoryName = dto.VCategoryName,
                Status = dto.Status
            }).ToList();
            try
            {
                //AddRangeAsync is more efficient for bulk inserts
                await context.PaymCategories.AddRangeAsync(newCategories);
                await context.SaveChangesAsync();
                return Ok(new { message = "Categories saved succeessfully" });
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error:{ex.Message}");
            }

        }
        [HttpGet("company/{companyId}")]
        public async Task<ActionResult<IEnumerable<PaymCategoryDto>>> GetByCompany(int companyId)
        {
            using var context = GetTenantContext();

            var data = await context.PaymCategories
                .Where(g => g.PnCompanyId == companyId)
                .Select(g => new PaymCategoryDto
                {
                    PnCompanyId = g.PnCompanyId,
                    // Convert the int to a string here so the frontend 
                    // receives the type it expects for your other pages
                    BranchId = g.BranchId.ToString(),
                    PnCategoryId = g.PnCategoryId,
                    VCategoryName = g.VCategoryName,
                    Status = g.Status
                }).ToListAsync();

            return Ok(data);
        }
        // Update Method
        [HttpPut]
        public async Task<IActionResult> UpdateCategory([FromBody] PaymCategoryDto categoryDto)
        {
            using var context = GetTenantContext();

            // Parse BranchId from string to int for the DB query
            int branchIdInt = int.Parse(categoryDto.BranchId);

            var existingCategory = await context.PaymCategories
                .FirstOrDefaultAsync(c => c.PnCompanyId == categoryDto.PnCompanyId &&
                                          c.BranchId == branchIdInt &&
                                          c.PnCategoryId == categoryDto.PnCategoryId);

            if (existingCategory == null) return NotFound("Category not found");

            // Update non-key properties
            existingCategory.VCategoryName = categoryDto.VCategoryName;
            existingCategory.Status = categoryDto.Status;

            await context.SaveChangesAsync();
            return Ok(new { message = "Updated successfully" });
        }

        // Delete Method
        [HttpDelete]
        public async Task<IActionResult> DeleteCategory([FromQuery] int companyId, [FromQuery] string branchId, [FromQuery] int categoryId)
        {
            using var context = GetTenantContext();
            int branchIdInt = int.Parse(branchId);

            var category = await context.PaymCategories
                .FirstOrDefaultAsync(c => c.PnCompanyId == companyId &&
                                          c.BranchId == branchIdInt &&
                                          c.PnCategoryId == categoryId);

            if (category == null) return NotFound();

            context.PaymCategories.Remove(category);
            await context.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully" });
        }






    }
}
