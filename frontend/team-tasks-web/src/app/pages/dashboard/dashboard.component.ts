import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { DeveloperDelayRisk } from '../../core/models/developer-delay-risk.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, switchMap, timer } from 'rxjs';
import { DeveloperWorkload } from '../../core/models/DeveloperWorkload.model';
import { ProjectSummary } from '../../core/models/ProjectSummary.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule],
})
export class DashboardComponent implements OnInit {
  developerWorkload: DeveloperWorkload[] = [];
  projectSummary: ProjectSummary[] = [];
  developerDelayRisk: DeveloperDelayRisk[] = [];
  loading = true;
  errorMessage = '';

  // Filters
  developerSearch = '';
  projectSearch = '';
  riskFilter: '' | '1' | '0' = '';

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  sortOrder: { [key: string]: 'asc' | 'desc' } = {
    developerName: 'asc',
    openTasksCount: 'desc',
  };

  sortWorkload(property: 'developerName' | 'openTasksCount'): void {
    this.sortOrder[property] = this.sortOrder[property] === 'asc' ? 'desc' : 'asc';
    const order = this.sortOrder[property];

    this.developerWorkload.sort((a, b) => {
      const valA = a[property];
      const valB = b[property];

      if (order === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
    this.cdr.detectChanges();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    timer(1500)
      .pipe(
        switchMap(() =>
          forkJoin({
            workload: this.dashboardService.getDeveloperWorkload(),
            projects: this.dashboardService.getProjectSummary(),
            risks: this.dashboardService.getDeveloperDelayRisk(),
          }),
        ),
      )
      .subscribe({
        next: (data) => {
          this.developerWorkload = data.workload || [];
          this.projectSummary = data.projects || [];
          this.developerDelayRisk = data.risks || [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error completo:', err);
          this.errorMessage = `Error al cargar el dashboard: ${err.message || 'Error desconocido'}`;
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  get filteredDeveloperWorkload(): DeveloperWorkload[] {
    if (!this.developerSearch.trim()) {
      return this.developerWorkload;
    }
    return this.developerWorkload.filter((d) =>
      d.developerName.toLowerCase().includes(this.developerSearch.toLowerCase()),
    );
  }

  get filteredProjectSummary(): ProjectSummary[] {
    if (!this.projectSearch.trim()) {
      return this.projectSummary;
    }
    return this.projectSummary.filter((p) =>
      p.projectName.toLowerCase().includes(this.projectSearch.toLowerCase()),
    );
  }

  get filteredRiskData(): DeveloperDelayRisk[] {
    if (!this.riskFilter) {
      return this.developerDelayRisk;
    }
    return this.developerDelayRisk.filter((r) => String(r.highRiskFlag) === this.riskFilter);
  }
}
