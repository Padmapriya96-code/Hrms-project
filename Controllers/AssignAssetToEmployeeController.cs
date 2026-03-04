using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymousJwt]
    public class AssignAssetToEmployeeController : Controller
    {
        private readonly HrmsystemContext _context;

        public AssignAssetToEmployeeController(HrmsystemContext context)
        {
            _context = context;
        }
        [HttpPost("assign-asset-to-employee/details")]
        public async Task<IActionResult> AssignAssetToEmployeeReturnDetails([FromBody] AssetAssignmentDto input)
        {
            try
            {
                var results = await _context.Assets
                    .FromSqlRaw("EXEC AssignAssetToEmployee @pnCompanyId = {0}, @pnBranchId = {1}, @pnEmployeeId = {2}, @AssetName = {3}, @AssetSerialNumber = {4}, @AssetType = {5}",
                                input.PnCompanyId,
                                input.BranchId,
                                input.PnEmployeeId,
                                input.AssetName,
                                input.AssetSerialNumber,
                                input.AssetType ?? (object)DBNull.Value)
                    .ToListAsync();

                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }

        // GET: api/AssignAssetToEmployee/with-employee
        [HttpGet("with-employee")]
        public async Task<ActionResult<IEnumerable<object>>> GetAssetsWithEmployeeDetails(
       [FromQuery] int? companyId, [FromQuery] int? branchId)
        {
            var query = from asset in _context.Assets
                        join emp in _context.PaymEmployees
                            on asset.AssetAssignedTo equals emp.PnEmployeeId into ae
                        from emp in ae.DefaultIfEmpty()
                        select new
                        {
                            asset.PnAssetid,
                            asset.PnCompanyId,
                            asset.BranchId,
                            asset.AssetName,
                            asset.AssetSerialNumber,
                            asset.Status,
                            asset.PurchaseDate,
                            asset.AssetValue,
                            asset.Description,
                            asset.CreatedDate,
                            asset.AssetType,
                            AssignedToEmployeeId = emp != null ? emp.PnEmployeeId : (int?)null,
                            AssignedToEmployeeName = emp != null
                                ? emp.EmployeeFirstName + " " + emp.EmployeeLastName
                                : null
                        };

            if (companyId.HasValue)
                query = query.Where(x => x.PnCompanyId == companyId);

            if (branchId.HasValue)
                query = query.Where(x => x.BranchId == branchId);

            var result = await query.ToListAsync();
            return Ok(result);
        }

        // GET: api/AssignAssetToEmployee/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Asset>> GetAssetById(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null) return NotFound("Asset not found.");
            return Ok(asset);
        }


        // ✅ PUT: api/AssignAssetToEmployee/5 (Update asset details by ID)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsset(int id, [FromBody] Asset updatedAsset)
        {
            if (id != updatedAsset.PnAssetid)
                return BadRequest("Asset ID mismatch.");

            _context.Entry(updatedAsset).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok("Asset updated successfully.");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Assets.Any(e => e.PnAssetid == id))
                    return NotFound("Asset not found.");
                else
                    throw;
            }
        }

        // ✅ DELETE: api/AssignAssetToEmployee/5 (Delete asset by ID)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsset(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null)
                return NotFound("Asset not found.");

            _context.Assets.Remove(asset);
            await _context.SaveChangesAsync();

            return Ok("Asset deleted successfully.");
        }
    }
}