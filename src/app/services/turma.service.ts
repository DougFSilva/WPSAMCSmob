import { Turma } from "src/app/models/Turma";
import { API_CONFIG } from "./../config/api.config";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TurmaService {
  constructor(private http: HttpClient) {}

  create(cursoId: number, turma: Turma): Observable<Turma> {
    return this.http.post<Turma>(
      `${API_CONFIG.baseUrl}/turma/create/${cursoId}`,
      turma
    );
  }

  deleteById(id: number): Observable<Turma> {
    return this.http.delete<Turma>(`${API_CONFIG.baseUrl}/turma/${id}`);
  }

  update(id: number, turma: Turma): Observable<Turma> {
    return this.http.put<Turma>(`${API_CONFIG.baseUrl}/turma/${id}`, turma);
  }

  findAll(): Observable<Turma[]> {
    return this.http.get<Turma[]>(`${API_CONFIG.baseUrl}/turma`);
  }

  findById(id: any): Observable<Turma> {
    return this.http.get<Turma>(`${API_CONFIG.baseUrl}/turma/${id}`);
  }

  findByCodigo(codigo: string): Observable<Turma> {
    return this.http.get<Turma>(`${API_CONFIG.baseUrl}/turma/codigo/${codigo}`);
  }

  findAllByCursoId(idCurso: number): Observable<Turma[]> {
    return this.http.get<Turma[]>(
      `${API_CONFIG.baseUrl}/turma/curso/${idCurso}`
    );
  }
}
