using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Authorization;
using HRMSAPPLICATION.Infrastructure;
using HRMSAPPLICATION.DTO;
using Microsoft.AspNetCore.Mvc;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GradeSlabDivisionController : Controller
    {
        private readonly TenantDbContextFactory _factory;
        public GradeSlabDivisionController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }
        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);

        }
        [HttpGet]
        public async Task<ActionResult<GradeSlabDivision>> GetAll()
        {
            using var context = GetTenantContext();
            var items = await context.GradeSlabDivisions.ToListAsync();
            return Ok(items);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GradeSlabDivisionDto dto)
        {
            using var context = GetTenantContext();
            var entity = new GradeSlabDivision
            {
                PnCompanyId = dto.PnCompanyId,
                PnDivisionId = dto.PnDivisionId,
                PnBranchId = dto.PnBranchId,
                GradeName = dto.GradeName,
                LevelName = dto.LevelName,
                CTC = dto.CTC,
                ExperienceFrom = dto.ExperienceFrom,
                ExperienceTo = dto.ExperienceTo
            };
            context.GradeSlabDivisions.Add(entity);
            await context.SaveChangesAsync();
            return Ok(entity);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] GradeSlabDivisionDto dto)
        {
            using var context = GetTenantContext();
            var existing = await context.GradeSlabDivisions.FindAsync(id);
            if (existing == null)
                return NotFound();
            existing.GradeName = dto.GradeName;
            existing.CTC = dto.CTC;
            await context.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            using var context = GetTenantContext();
            var existing = await context.GradeSlabDivisions.FindAsync(id);
            if (existing == null)
                return NotFound();
            context.GradeSlabDivisions.Remove(existing);
            await context.SaveChangesAsync();
            return NoContent();
        }
    }
}
