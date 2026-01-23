import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { ProjectsService } from '../../core/services/projects.service';
import { TasksService } from '../../core/services/tasks.service';
import { Project } from '../../core/models/project.model';
import { Task } from '../../core/models/task.model';
import { CreateTaskDto } from '../../core/models/dtos/create-task.dto';
import { DeveloperListItem } from '../../core/models/DeveloperListItem.model';
import { DevelopersService } from '../../core/services/developers.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  tasks: Task[] = [];
  allTasks: Task[] = [];
  developers: DeveloperListItem[] = [];
  loading = true;
  errorMessage = '';
  selectedProjectId: number | null = null;
  showCreateTask = false;
  showTaskDetail = false;
  selectedTask: Task | null = null;

  filterStatus: string = '';
  filterDeveloper: number | null = null;
  filterPriority: string = '';

  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  newTask: CreateTaskDto = {
    projectId: 0,
    title: '',
    description: '',
    assigneeId: 0,
    priority: '',
    status: '',
    estimatedComplexity: 1,
    dueDate: '',
  };

  /** ==================== GRÁFICOS ==================== */
  chartMode: 'status' | 'priority' = 'status';
  chartType: ChartType = 'doughnut';

  chartData: ChartData<'doughnut', number[], string> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  constructor(
    private projectsService: ProjectsService,
    private tasksService: TasksService,
    private developersService: DevelopersService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadDevelopers();
  }

  loadProjects(): void {
    this.loading = true;
    this.errorMessage = '';
    this.projectsService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }, 1500);
      },
      error: (err) => {
        console.error('Error cargando proyectos', err);
        this.loading = false;
        this.errorMessage = `Error al cargar el dashboard: ${err.message || 'Error desconocido'}`;
      },
    });
  }

  loadDevelopers(): void {
    this.developersService.getActiveDevelopers().subscribe({
      next: (data) => {
        this.developers = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando desarrolladores:', err);
      },
    });
  }

  selectProject(projectId: number): void {
    this.selectedProjectId = projectId;
    this.resetFilters();

    this.tasksService.getByProject(projectId).subscribe({
      next: (data) => {
        this.allTasks = data;
        this.applyFilters();
        this.updateChart();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando tareas', err);
        this.tasks = [];
        this.allTasks = [];
      },
    });
  }

  resetFilters(): void {
    this.filterStatus = '';
    this.filterDeveloper = null;
    this.filterPriority = '';
    this.page = 1;
  }

  applyFilters(): void {
    let filtered = [...this.allTasks];

    if (this.filterStatus) {
      filtered = filtered.filter((t) => t.status === this.filterStatus);
    }

    if (this.filterDeveloper) {
      filtered = filtered.filter((t) => t.assigneeId === this.filterDeveloper);
    }

    if (this.filterPriority) {
      filtered = filtered.filter((t) => t.priority === this.filterPriority);
    }

    this.totalPages = Math.ceil(filtered.length / this.pageSize);

    if (this.page > this.totalPages && this.totalPages > 0) {
      this.page = this.totalPages;
    }

    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.tasks = filtered.slice(start, end);

    this.cdr.detectChanges();
  }

  onFilterChange(): void {
    this.page = 1;
    this.applyFilters();
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.applyFilters();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.applyFilters();
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.applyFilters();
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;

    let start = Math.max(1, this.page - Math.floor(maxPages / 2));
    let end = Math.min(this.totalPages, start + maxPages - 1);

    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  viewTaskDetail(task: Task): void {
    this.selectedTask = task;
    this.showTaskDetail = true;
  }

  closeTaskDetail(): void {
    this.showTaskDetail = false;
    this.selectedTask = null;
  }

  /** ==================== MODAL ==================== */
  openCreateTaskModal(projectId: number): void {
    this.selectedProjectId = projectId;
    this.showCreateTask = true;
  }

  cancelCreateTask(): void {
    this.resetCreateForm();
  }

  resetCreateForm(): void {
    this.showCreateTask = false;
    this.newTask = {
      projectId: this.selectedProjectId ?? 0,
      title: '',
      description: '',
      assigneeId: 0,
      priority: '',
      status: '',
      estimatedComplexity: 1,
      dueDate: '',
    };
  }

createTask(): void {
  // 1. Validación de campos obligatorios (sin permitir espacios vacíos)
  const isInvalid = (val: any) => val === null || val === undefined || String(val).trim() === '';

  if (
    isInvalid(this.newTask.title) ||
    isInvalid(this.newTask.description) ||
    isInvalid(this.newTask.status) ||
    isInvalid(this.newTask.priority) ||
    isInvalid(this.newTask.dueDate) ||
    !this.newTask.assigneeId ||
    this.newTask.assigneeId <= 0
  ) {
    this.alertService.warning('Formulario Incompleto', 'Debes llenar todos los campos obligatorios.');
    return;
  }

  // 2. Validación de fecha
  const selectedDate = new Date(this.newTask.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    this.alertService.warning('Fecha Inválida', 'La fecha no puede ser anterior a hoy.');
    return;
  }

  // 3. CONSTRUCCIÓN DEL OBJETO FINAL (Garantía Anti-Null)
  // Usamos el operador || "" para que si algo llega a ser null, se convierta en texto vacío.
  const taskData: CreateTaskDto = {
    projectId: Number(this.selectedProjectId),
    title: (this.newTask.title || "").trim(),
    description: (this.newTask.description || "").trim(), // Aquí aseguramos que NUNCA sea null
    assigneeId: Number(this.newTask.assigneeId),
    priority: this.newTask.priority || "",
    status: this.newTask.status || "",
    estimatedComplexity: this.newTask.estimatedComplexity || 1,
    dueDate: selectedDate.toISOString()
  };

  console.log("Objeto final enviado a la API:", taskData);

  this.tasksService.create(taskData).subscribe({
    next: () => {
      this.alertService.success('¡Éxito!', 'Tarea creada correctamente.');
      this.selectProject(this.selectedProjectId!);
      this.showCreateTask = false;
      this.resetCreateForm();
    },
    error: (err) => {
      console.error("Error capturado:", err);
      // Si el error es 400, es porque el DTO en C# sigue rechazando algo
      const msg = err.error?.message || 'Error al guardar. Revisa la consola.';
      this.alertService.error('Error', msg);
    }
  });
}

  /** ==================== GRÁFICOS ==================== */
  updateChart(): void {
    this.chartMode === 'status' ? this.buildStatusChart() : this.buildPriorityChart();
  }

  private buildStatusChart(): void {
    const counter: Record<string, number> = {
      ToDo: 0,
      InProgress: 0,
      Completed: 0,
      Blocked: 0,
    };

    this.allTasks.forEach((t) => counter[t.status] !== undefined && counter[t.status]++);

    this.chartData = {
      labels: Object.keys(counter),
      datasets: [{ data: Object.values(counter) }],
    };
  }

  private buildPriorityChart(): void {
    const counter: Record<string, number> = {
      Low: 0,
      Medium: 0,
      High: 0,
    };

    this.allTasks.forEach((t) => counter[t.priority] !== undefined && counter[t.priority]++);

    this.chartData = {
      labels: Object.keys(counter),
      datasets: [{ data: Object.values(counter) }],
    };
  }
}
