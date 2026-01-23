using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeamTasks.Api.Data;

namespace TeamTasks.Api.Controllers
{
    [ApiController]
    [Route("api/developers")]
    public class DevelopersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DevelopersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetActiveDevelopers()
        {
            var devs = await _context.Developers
                .Where(d => d.IsActive)
                .AsNoTracking()
                .Select(d => new
                {
                    d.DeveloperId,
                    FullName = d.FirstName + " " + d.LastName,
                    d.Email
                })
                .ToListAsync();

            return Ok(devs);
        }
    }
}
