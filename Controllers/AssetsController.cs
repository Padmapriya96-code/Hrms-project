using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymousJwt]
    public class AssetsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public AssetsController(HrmsystemContext context)
        {
            _context = context;
        }

        // ✅ Get all assets for a specific company
        // GET: api/Assets/company/1
        [HttpGet("company/{companyId}")]
        public async Task<ActionResult<IEnumerable<Asset>>> GetAssetsByCompany(int companyId)
        {
            var assets = await _context.Assets
                .Where(a => a.PnCompanyId == companyId)
                .ToListAsync();

            return Ok(assets);
        }

        // ✅ Get all assets for a specific company and branch
        // GET: api/Assets/company/1/branch/2
        [HttpGet("company/{companyId}/branch/{branchId}")]
        public async Task<ActionResult<IEnumerable<Asset>>> GetAssetsByCompanyAndBranch(int companyId, int branchId)
        {
            var assets = await _context.Assets
                .Where(a => a.PnCompanyId == companyId && a.BranchId == branchId)
                .ToListAsync();

            return Ok(assets);
        }

        // ✅ Get a single asset by ID
        // GET: api/Assets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Asset>> GetAsset(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null)
                return NotFound();

            return asset;
        }

        // ✅ Create a new asset
        // POST: api/Assets
        [HttpPost]
        public async Task<ActionResult<Asset>> PostAsset(Asset asset)
        {
            if (asset.PnCompanyId == 0)
                return BadRequest("Company ID is required.");

            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAsset), new { id = asset.PnAssetid }, asset);
        }

        // ✅ Update an existing asset
        // PUT: api/Assets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsset(int id, Asset asset)
        {
            if (id != asset.PnAssetid)
                return BadRequest("Asset ID mismatch.");

            _context.Entry(asset).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Assets.Any(e => e.PnAssetid == id))
                    return NotFound();
                else
                    throw;
            }
        }

        // ✅ Delete an asset
        // DELETE: api/Assets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsset(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null)
                return NotFound();

            _context.Assets.Remove(asset);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}