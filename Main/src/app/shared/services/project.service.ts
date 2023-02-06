import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projectURL: string = environment.apiUrl + '/projects';

  constructor(private httpClient: HttpClient) { }

  getProjects(): Observable<any> {
    return this.httpClient.get<Project[]>(`${this.projectURL}?OrderBy=8&PageSize=100`);
  }

  getProjectById(id): Observable<Project> {
    return this.httpClient.get<Project>(`${this.projectURL}/${id}`);
  }

  deleteProject(project:Project): Observable<Project> {
    project.status = 0;
    return this.httpClient.put<Project>(`${this.projectURL}`, project);
  }

  insertProject(project: Project): Observable<Project>  {
    return this.httpClient.post<Project>(`${this.projectURL}`, project);
  }

  updateProject(project: Project): Observable<Project>  {
    return this.httpClient.put<Project>(`${this.projectURL}`, project);
  }
}
