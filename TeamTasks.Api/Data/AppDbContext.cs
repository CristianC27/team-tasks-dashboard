using Microsoft.EntityFrameworkCore;
using TeamTasks.Api.Models;
using TeamTasks.Api.DTOs;

namespace TeamTasks.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Developer> Developers => Set<Developer>();
        public DbSet<Project> Projects => Set<Project>();
        public DbSet<TaskItem> Tasks => Set<TaskItem>();
        public DbSet<DeveloperDelayRiskDto> DeveloperDelayRisks => Set<DeveloperDelayRiskDto>();
        public DbSet<DeveloperWorkloadDto> DeveloperWorkloads => Set<DeveloperWorkloadDto>();
        public DbSet<ProjectSummaryDto> ProjectSummaries => Set<ProjectSummaryDto>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<DeveloperDelayRiskDto>().HasNoKey();
            modelBuilder.Entity<DeveloperWorkloadDto>().HasNoKey();
            modelBuilder.Entity<ProjectSummaryDto>().HasNoKey();
        }
    }
}
