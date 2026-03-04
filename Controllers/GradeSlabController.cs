using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Authorization;
using HRMSAPPLICATION.Infrastructure;
using HRMSAPPLICATION.DTO;

namespace HRMSAPPLICATION.Controllers
{
    public class GradeSlabController : Controller
    {
        private readonly TenantDbContextFactory _factory;
        public GradeSlabController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }
        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<GradeSlabBranch>> GetById(int id)
        {
            using var context = GetTenantContext();
            var item = await context.GradeSlabBranches.FindAsync(id);
            return item != null ? Ok(item) : NotFound();
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GradeSlabDto dto)
        {
            using var context = GetTenantContext();
            var entity = new GradeSlabBranch();
            MapToEntity(dto, entity);//use the helper method to map DTO to entity
            context.GradeSlabBranches.Add(entity);
            await context.SaveChangesAsync();
            return Ok(entity);
        }
        private void MapToEntity(GradeSlabDto dto, GradeSlabBranch entity)
        {
            entity.PnCompanyId = dto.PnCompanyId;
            entity.PnBranchId = dto.PnBranchId;
            entity.SlabType = dto.SlabType;
            entity.GradeName = dto.GradeName;
            entity.LevelName = dto.LevelName;
            entity.ExperienceFrom = dto.ExperienceFrom;
            entity.ExperienceTo = dto.ExperienceTo;
            entity.Value1 = dto.CTC; // Map CTC to Value1
            entity.Value2 = (decimal)dto.Division.GetHashCode();
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] GradeSlabDto dto)
        {
            using var context = GetTenantContext();
            var entity = await context.GradeSlabBranches.FindAsync(id);
            if (entity == null) return NotFound();
            MapToEntity(dto, entity); // Update the existing entity with new values
            await context.SaveChangesAsync();
            return Ok(entity);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            using var context = GetTenantContext();
            var item = await context.GradeSlabBranches.FindAsync(id);
            if(item==null) return NotFound();
            context.GradeSlabBranches.Remove(item);
            await context.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully" });
        }
    }
}
