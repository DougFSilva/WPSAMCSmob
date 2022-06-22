import { Ocorrencia } from "./../models/Ocorrencia";
import { API_CONFIG } from "./../config/api.config";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OcorrenciaFORM } from "../models/OcorrenciaFORM";

@Injectable({
  providedIn: "root",
})
export class OcorrenciaService {
  constructor(private http: HttpClient) {}

  findById(id: number): Observable<Ocorrencia> {
    return this.http.get<Ocorrencia>(`${API_CONFIG.baseUrl}/ocorrencia/${id}`);
  }

  findAllByAlunoId(idAluno: number): Observable<Ocorrencia[]> {
    return this.http.get<Ocorrencia[]>(
      `${API_CONFIG.baseUrl}/ocorrencia/aluno/${idAluno}`
    );
  }

  create(idAluno: number, ocorrencia: OcorrenciaFORM): Observable<Ocorrencia> {
    return this.http.post<Ocorrencia>(
      `${API_CONFIG.baseUrl}/ocorrencia/create/${idAluno}`,
      ocorrencia
    );
  }

  update(id: number, ocorrencia: Ocorrencia): Observable<Ocorrencia> {
    return this.http.put<Ocorrencia>(
      `${API_CONFIG.baseUrl}/ocorrencia/${id}`,
      ocorrencia
    );
  }

  delete(id: number) {
    return this.http.delete(`${API_CONFIG.baseUrl}/ocorrencia/${id}`);
  }
}
