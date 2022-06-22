import { Observable, retry, switchMap } from "rxjs";
import { API_CONFIG } from "./../config/api.config";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlunoFORM } from "../models/AlunoFORM";
import { Aluno } from "../models/Aluno";
import { PhotoFORM } from "../models/PhotoFORM";

@Injectable({
  providedIn: "root",
})
export class AlunoService {
  alunos: Aluno[] = [];

  constructor(private http: HttpClient) {}

  create(aluno: AlunoFORM): Observable<Aluno> {
    return this.http.post<Aluno>(`${API_CONFIG.baseUrl}/aluno/create`, aluno);
  }

  createAll(alunos: Aluno[]): Observable<Aluno[]> {
    return this.http.post<Aluno[]>(
      `${API_CONFIG.baseUrl}/aluno/create/all`,
      alunos
    );
  }

  saveImage(photo: PhotoFORM, id: number) {
    return this.http.post<Aluno>(
      `${API_CONFIG.baseUrl}/aluno/saveImage/${id}`,
      photo
    );
  }

  deleteById(id: number) {
    return this.http.delete(`${API_CONFIG.baseUrl}/aluno/${id}`);
  }

  update(alunoFORM: AlunoFORM): Observable<Aluno> {
    return this.http.put<Aluno>(
      `${API_CONFIG.baseUrl}/aluno/${alunoFORM.id}`,
      alunoFORM
    );
  }

  updateStatus(id: number, status: string): Observable<Aluno> {
    return this.http.put<Aluno>(
      `${API_CONFIG.baseUrl}/aluno/${id}/status/${status}`,
      null
    );
  }

  updateTermoInternet(id: number, termoInternet: boolean): Observable<Aluno> {
    return this.http.put<Aluno>(
      `${API_CONFIG.baseUrl}/aluno/${id}/termoInternet/${termoInternet}`,
      null
    );
  }

  updateInternetLiberada(
    id: number,
    internetLiberada: boolean
  ): Observable<Aluno> {
    return this.http.put<Aluno>(
      `${API_CONFIG.baseUrl}/aluno/${id}/internetLiberada/${internetLiberada}`,
      null
    );
  }

  updateAllInternetLiberada(
    alunos: Aluno[],
    internetLiberada: boolean
  ): Observable<Aluno[]> {
    return this.http.put<Aluno[]>(
      `${API_CONFIG.baseUrl}/aluno/all/internetLiberada/${internetLiberada}`,
      alunos
    );
  }

  updateDesbloqueioTemporario(id: number, desbloqueio: boolean) {
    return this.http.put<Aluno>(
      `${API_CONFIG.baseUrl}/aluno/desbloqueioTemporario/${id}/${desbloqueio}`,
      null
    );
  }

  move(idTurmaAtual: number, idTurmaDestino: number): Observable<Aluno[]> {
    return this.http.put<Aluno[]>(
      `${API_CONFIG.baseUrl}/aluno/move/${idTurmaAtual}/to/${idTurmaDestino}`,
      null
    );
  }

  findAllByStatus(status: string): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(
      `${API_CONFIG.baseUrl}/aluno/status/${status}`
    );
  }

  findAllByStatusLazy(status: string): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(
      `${API_CONFIG.baseUrl}/aluno/status/${status}/lazy`
    );
  }

  findById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${API_CONFIG.baseUrl}/aluno/${id}`);
  }

  findByTag(tag: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${API_CONFIG.baseUrl}/aluno/tag/${tag}`);
  }

  findByTurmaId(idTurma: number): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(
      `${API_CONFIG.baseUrl}/aluno/turma/${idTurma}`
    );
  }

  findAllByCurso(idCurso: number, status: string): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(
      `${API_CONFIG.baseUrl}/aluno/curso/${idCurso}/status/${status}`
    );
  }
}
