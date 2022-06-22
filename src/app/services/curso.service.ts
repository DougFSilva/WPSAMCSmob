import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/Curso';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  constructor(
    private http: HttpClient
    ) { }

    create(curso : Curso): Observable<Curso>{
      return this.http.post<Curso>(`${API_CONFIG.baseUrl}/curso/create`, curso)
    }

    update(id: number, curso : Curso): Observable<Curso>{
      return this.http.put<Curso>(`${API_CONFIG.baseUrl}/curso/${id}`, curso)
    }

    deleteById(id : number){
      return this.http.delete<Curso>(`${API_CONFIG.baseUrl}/curso/${id}`)
    }

    findAll(): Observable<Curso[]>{
      return this.http.get<Curso[]>(`${API_CONFIG.baseUrl}/curso`)
    }

    findById(id: number):Observable<Curso>{
      return this.http.get<Curso>(`${API_CONFIG.baseUrl}/curso/${id}`)
    }

    findByTurmaCodigo(codigo: string): Observable<Curso>{
      return this.http.get<Curso>(`${API_CONFIG.baseUrl}/curso/turma/${codigo}`)
    }

}
