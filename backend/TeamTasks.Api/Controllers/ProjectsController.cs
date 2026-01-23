using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeamTasks.Api.Data;

namespace TeamTasks.Api.Controllers
{
    [ApiController]
    [Route("api/projects")]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        // Lista todos los proyectos
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _context.Projects
                .AsNoTracking()
                .ToListAsync();

            return Ok(projects);
        }

        [HttpGet("{id}/tasks")]
        public async Task<IActionResult> GetTasksByProject(int id)
        {
            var exists = await _context.Projects.AnyAsync(p => p.ProjectId == id);
            if (!exists) return NotFound("Project not found");

            var tasks = await (from t in _context.Tasks
                               join d in _context.Developers on t.AssigneeId equals d.DeveloperId
                               where t.ProjectId == id
                               select new
                               {
                                   t.TaskId,
                                   t.ProjectId,
                                   t.AssigneeId,
                                   t.Title,
                                   t.Description,
                                   t.Status,
                                   t.Priority,
                                   t.EstimatedComplexity,
                                   t.DueDate,
                                   t.CreatedAt,
                                   DeveloperFullName = d.FirstName + " " + d.LastName
                               })
                               .AsNoTracking()
                               .ToListAsync();
            return Ok(tasks);
        }


    }
}
