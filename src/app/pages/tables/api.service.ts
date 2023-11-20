import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/tareas/get';

  constructor(private http: HttpClient) {}

  //GET
  getTareas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  //GET ID
  getTareaById(id): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get(url);
  }

  //POST
  agregarTarea(tarea): Observable<any> {
    return this.http.post('http://localhost:8080/tareas/create', tarea);
  }

  //PUT
  actualizarTarea(id, tarea): Observable<any> {
    const url = `${this.apiUrl}/edit/${id}`;
    return this.http.put(url, tarea);
  }

  //DELETE
  eliminarTarea(id): Observable<any> {
    const url = `${this.apiUrl}/del/${id}`;
    return this.http.delete(url);
  }
}
