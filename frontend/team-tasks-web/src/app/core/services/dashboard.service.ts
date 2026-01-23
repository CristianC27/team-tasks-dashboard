import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { DeveloperDelayRisk } from '../models/developer-delay-risk.model';
import { DeveloperWorkload } from '../models/DeveloperWorkload.model';
import { ProjectSummary } from '../models/ProjectSummary.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getDeveloperWorkload(): Observable<DeveloperWorkload[]> {
    return this.http.get<DeveloperWorkload[]>(`${this.apiUrl}/developer-workload`);
  }

  getProjectSummary(): Observable<ProjectSummary[]> {
    return this.http.get<ProjectSummary[]>(`${this.apiUrl}/project-summary`);
  }

  getDeveloperDelayRisk(): Observable<DeveloperDelayRisk[]> {
    return this.http.get<DeveloperDelayRisk[]>(`${this.apiUrl}/developer-delay-risk`);
  }
}
