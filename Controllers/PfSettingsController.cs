using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;
using HRMSAPPLICATION.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using HRMSAPPLICATION.DTO;
using System.Linq.Expressions;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PfSettingsController : Controller
    {
        private readonly TenantDbContextFactory _factory;
        public PfSettingsController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }
        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);
        }
        [HttpGet("{companyId}")]
        public async Task<ActionResult<PfsettingDto>> GetSettings(int companyId)
        {
            //using var context = GetTenantContext();
            //var settings = await context.PfSettings
            //    .FirstOrDefaultAsync(s => s.PnCompanyId == companyId);

            //if (settings == null)
            //{
            //    return NotFound(new { message = "No PF settings found for this company." });
            //}

            //// Mapping with safety checks to prevent casting errors
            //var dto = new PfsettingDto
            //{
            //    PnCompanyId = settings.PnCompanyId,
            //    EffectiveMonthFrom = settings.EffectiveMonthFrom ?? "January",
            //    EffectiveFromYear = settings.EffectiveFromYear ?? DateTime.Now.Year,

            //    // Convert double? to double, then map to DTO
            //    PfContribution = settings.PfContributionPercentage ?? 0.0,
            //    EpfContribution = settings.EpfContributionPercentage ?? 0.0,
            //    EpsContribution = settings.EpsContributionPercentage ?? 0.0,
            //    AdminCharges = settings.AdminChargesPercentage ?? 0.0,

            //    // Map decimal? to decimal
            //    UpperLimit = settings.UpperLimit.GetValueOrDefault(0m),
            //    EligibilityAmount = settings.EligibilityAmount.GetValueOrDefault(0m),

            //    MaxCeiling = settings.MaxCeiling ?? "No",
            //    PfBelowCeiling = settings.PfBelowCeiling ?? "No",
            //    RoundingOptions = settings.RoundingOptions ?? "None"
            //};

            //return Ok(dto);
            using var context = GetTenantContext();

            // Line 30: Ensure the context knows about the table name
            var settings = await context.PfSettings
                .FirstOrDefaultAsync(s => s.PnCompanyId == companyId);

            if (settings == null) return NotFound(new { message = "No settings found." });

            return Ok(new PfsettingDto
            {
                PnCompanyId = settings.PnCompanyId,
                EffectiveMonthFrom = settings.EffectiveMonthFrom ?? "January",
                EffectiveFromYear = settings.EffectiveFromYear ?? DateTime.Now.Year,

                // Safely map double? to double
                PfContribution = settings.PfContributionPercentage ?? 0.0,
                EpfContribution = settings.EpfContributionPercentage ?? 0.0,
                EpsContribution = settings.EpsContributionPercentage ?? 0.0,
                AdminCharges = settings.AdminChargesPercentage ?? 0.0,

                // Safely map decimal? to decimal
                UpperLimit = settings.UpperLimit ?? 0m,
                EligibilityAmount = settings.EligibilityAmount ?? 0m,

                MaxCeiling = settings.MaxCeiling ?? "No",
                PfBelowCeiling = settings.PfBelowCeiling ?? "No",
                RoundingOptions = settings.RoundingOptions ?? "None"
            });
        }

        [HttpPost]
        public async Task<IActionResult> SaveSettings([FromBody] PfsettingDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest("Invalid data received");
                }

                using var context = GetTenantContext();

                // Check if settings already exist for this company
                var existing = await context.PfSettings
                    .FirstOrDefaultAsync(s => s.PnCompanyId == dto.PnCompanyId);


                if (existing == null)
                {
                    // INSERT Logic
                    var newSettings = new PfSettings
                    {
                        PnCompanyId = dto.PnCompanyId,
                        EffectiveMonthFrom = dto.EffectiveMonthFrom,
                        EffectiveFromYear = dto.EffectiveFromYear,
                        PfContributionPercentage =(double) dto.PfContribution,
                        MaxCeiling = dto.MaxCeiling,
                        PfBelowCeiling = dto.PfBelowCeiling,
                        EpfContributionPercentage = (double)dto.EpfContribution,
                        UpperLimit = (decimal?)dto.UpperLimit,
                        EpsContributionPercentage = (double)dto.EpsContribution,
                        EligibilityAmount = (decimal?) dto.EligibilityAmount,
                        AdminChargesPercentage = (double)dto.AdminCharges,
                        RoundingOptions = dto.RoundingOptions
                    };
                    context.PfSettings.Add(newSettings);
                }
                else
                {
                    // UPDATE Logic
                    existing.EffectiveMonthFrom = dto.EffectiveMonthFrom;
                    existing.EffectiveFromYear = dto.EffectiveFromYear;
                    existing.PfContributionPercentage = (double)dto.PfContribution;
                    existing.MaxCeiling = dto.MaxCeiling;
                    existing.PfBelowCeiling = dto.PfBelowCeiling;
                    existing.EpfContributionPercentage = (double)dto.EpfContribution;
                    existing.UpperLimit = (decimal?) dto.UpperLimit;
                    existing.EpsContributionPercentage = (double)dto.EpsContribution;
                    existing.EligibilityAmount = (decimal?)dto.EligibilityAmount;
                    existing.AdminChargesPercentage = (double)dto.AdminCharges;
                    existing.RoundingOptions = dto.RoundingOptions;

                    context.PfSettings.Update(existing);
                }

                await context.SaveChangesAsync();
                return Ok(new { message = "PF Settings saved successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Error: {ex.Message} | Stack: {ex.StackTrace}");


            }
        }
    }
}
