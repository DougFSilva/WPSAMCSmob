import { API_CONFIG } from "./../config/api.config";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Aula } from "../models/Aula";
import { AulaFORM } from "../models/AulaFORM";

@Injectable({
  providedIn: "root",
})
export class AulaService {
  constructor(private http: HttpClient) {}

  createAll(idTurma: number, aulas: AulaFORM[]): Observable<Aula[]> {
    return this.http.post<Aula[]>(
      `${API_CONFIG.baseUrl}/aula/turma/${idTurma}/createAll`,
      aulas
    );
  }

  deleteAll(idTurma: number) {
    return this.http.delete(
      `${API_CONFIG.baseUrl}/aula/turma/${idTurma}/deleteAll`
    );
  }

  findAllByTurma(idTurma: number): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${API_CONFIG.baseUrl}/aula/turma/${idTurma}`);
  }
}
