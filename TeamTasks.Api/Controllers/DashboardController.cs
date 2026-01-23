using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeamTasks.Api.Data;
using TeamTasks.Api.DTOs;

namespace TeamTasks.Api.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("developer-delay-risk")]
        public async Task<IActionResult> GetDeveloperDelayRisk()
        {
            var result = await _context.DeveloperDelayRisks
                .FromSqlRaw(@"
                    SELECT
                        d.firstname || ' ' || d.lastname AS DeveloperName,
                        COALESCE(open_tasks.opentaskscount, 0) AS OpenTasksCount,
                        COALESCE(avg_delay.avgdelaydays, 0)::INT AS AvgDelayDays,
                        open_tasks.nearestduedate AS NearestDueDate,
                        open_tasks.latestduedate AS LatestDueDate,

                        CASE
                            WHEN open_tasks.latestduedate IS NOT NULL
                            THEN open_tasks.latestduedate + COALESCE(avg_delay.avgdelaydays, 0)::INT
                            ELSE NULL
                        END AS PredictedCompletionDate,

                        CASE
                            WHEN COALESCE(avg_delay.avgdelaydays, 0) >= 3
                            THEN 1
                            ELSE 0
                        END AS HighRiskFlag
                    FROM developers d

                    LEFT JOIN (
                        SELECT
                            assigneeid,
                            COUNT(*) AS opentaskscount,
                            MIN(duedate) AS nearestduedate,
                            MAX(duedate) AS latestduedate
                        FROM tasks
                        WHERE status <> 'Completed'
                        GROUP BY assigneeid
                    ) open_tasks ON open_tasks.assigneeid = d.developerid

                    LEFT JOIN (
                        SELECT
                            assigneeid,
                            AVG(GREATEST((completiondate - duedate), 0)) AS avgdelaydays
                        FROM tasks
                        WHERE status = 'Completed'
                          AND completiondate IS NOT NULL
                        GROUP BY assigneeid
                    ) avg_delay ON avg_delay.assigneeid = d.developerid

                    WHERE d.isactive = TRUE
                    ORDER BY HighRiskFlag DESC, AvgDelayDays DESC
                ")
                .AsNoTracking()
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("developer-workload")]
        public async Task<IActionResult> GetDeveloperWorkload()
        {
            var result = await _context.DeveloperWorkloads
                .FromSqlRaw(@"
                SELECT d.firstname || ' ' || d.lastname AS DeveloperName,
                COUNT(t.taskid) AS OpenTasksCount,
                COALESCE(AVG(t.estimatedcomplexity), 0) AS AverageEstimatedComplexity
            FROM developers d
            LEFT JOIN tasks t
                ON t.assigneeid = d.developerid
                AND t.status <> 'Completed'
            WHERE d.isactive = TRUE
            GROUP BY d.developerid, d.firstname, d.lastname
            ORDER BY OpenTasksCount DESC, DeveloperName ASC")
        .AsNoTracking()
        .ToListAsync();

            return Ok(result);
        }


        [HttpGet("project-summary")]
        public async Task<IActionResult> GetProjectSummary()
        {
            var result = await _context.ProjectSummaries
                .FromSqlRaw(@"
            SELECT
                p.name AS ProjectName,
                p.clientname AS ClientName,
                COUNT(t.taskid) AS TotalTasks,
                SUM(CASE WHEN t.status <> 'Completed' THEN 1 ELSE 0 END) AS OpenTasks,
                SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) AS CompletedTasks
            FROM projects p
            LEFT JOIN tasks t ON t.projectid = p.projectid
            GROUP BY p.projectid, p.name, p.clientname
            ORDER BY p.name
        ")
                .AsNoTracking()
                .ToListAsync();

            return Ok(result);
        }


        [HttpGet("db")]
        public IActionResult TestDb()
        {
            try
            {
                var devs = _context.Developers.Count();
                var tasks = _context.Tasks.Count();

                return Ok(new
                {
                    Connected = true,
                    Developers = devs,
                    Tasks = tasks
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}
