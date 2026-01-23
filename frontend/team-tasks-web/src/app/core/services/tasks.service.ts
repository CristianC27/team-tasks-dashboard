import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model';
import { CreateTaskDto } from '../models/dtos/create-task.dto';
import { UpdateTaskStatusDto } from '../models/dtos/update-task-status.dto';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getByProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.apiUrl}/projects/${projectId}/tasks`);
  }

  create(dto: CreateTaskDto): Observable<void> {
    return this.http.post<void>(this.apiUrl, dto);
  }

  updateStatus(dto: UpdateTaskStatusDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/status`, dto);
  }
}
