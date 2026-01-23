import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectsService {


  private baseUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getProjects() {
    return this.http.get<Project[]>(this.baseUrl);
  }

  getTasksByProject(projectId: number) {
    return this.http.get<Task[]>(`${this.baseUrl}/${projectId}/tasks`);
  }
}
