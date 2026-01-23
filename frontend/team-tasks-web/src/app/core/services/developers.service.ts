import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeveloperListItem } from '../models/DeveloperListItem.model';



@Injectable({
  providedIn: 'root'
})
export class DevelopersService {
  private apiUrl = `${environment.apiUrl}/developers`;

  constructor(private http: HttpClient) {}

  getActiveDevelopers(): Observable<DeveloperListItem[]> {
    return this.http.get<DeveloperListItem[]>(this.apiUrl);
  }
}
