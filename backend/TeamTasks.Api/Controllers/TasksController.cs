using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeamTasks.Api.Data;
using TeamTasks.Api.DTOs;
using TeamTasks.Api.Models;

namespace TeamTasks.Api.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        // Crear nueva tarea
        [HttpPost]
        public async Task<IActionResult> CreateTask(CreateTaskDto dto)
        {
            if (!await _context.Projects.AnyAsync(p => p.ProjectId == dto.ProjectId))
                return BadRequest("Project not found");

            if (!await _context.Developers.AnyAsync(d => d.DeveloperId == dto.AssigneeId))
                return BadRequest("Developer not found");

            var task = new TaskItem
            {
                ProjectId = dto.ProjectId,
                AssigneeId = dto.AssigneeId,
                Title = dto.Title,
                Description = dto.Description,
                Status = dto.Status,
                Priority = dto.Priority,
                EstimatedComplexity = dto.EstimatedComplexity,
                DueDate = dto.DueDate,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(CreateTask), new { id = task.TaskId }, task);
        }

        // Actualizar el estado de la tarea
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateTaskStatus(int id, UpdateTaskStatusDto dto)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
                return NotFound("Task not found");

            task.Status = dto.Status;

            if (!string.IsNullOrWhiteSpace(dto.Priority))
                task.Priority = dto.Priority;

            if (dto.EstimatedComplexity.HasValue)
            {
                if (dto.EstimatedComplexity < 1 || dto.EstimatedComplexity > 5)
                    return BadRequest("EstimatedComplexity must be between 1 and 5");

                task.EstimatedComplexity = dto.EstimatedComplexity.Value;
            }

            if (dto.Status == "Completed")
                task.CompletionDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
