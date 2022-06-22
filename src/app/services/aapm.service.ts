import { InvestimentoAapm } from "./../models/InvestimentoAapm";
import { Observable } from "rxjs";
import { AapmFORM } from "./../models/AapmFORM";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../config/api.config";
import { Aapm } from "../models/Aapm";

@Injectable({
  providedIn: "root",
})
export class AapmService {
  constructor(private http: HttpClient) {}

  create(idAluno: number, aapmFORM: AapmFORM): Observable<Aapm> {
    return this.http.post<Aapm>(
      `${API_CONFIG.baseUrl}/aapm/create/${idAluno}`,
      aapmFORM
    );
  }

  delete(id: number) {
    return this.http.delete<Aapm>(`${API_CONFIG.baseUrl}/aapm/${id}`);
  }

  update(aapmFORM: AapmFORM): Observable<Aapm> {
    return this.http.put<Aapm>(
      `${API_CONFIG.baseUrl}/aapm/${aapmFORM.id}`,
      aapmFORM
    );
  }

  findById(id: number): Observable<Aapm> {
    return this.http.get<Aapm>(`${API_CONFIG.baseUrl}/aapm/${id}`);
  }

  findAll(): Observable<Aapm[]> {
    return this.http.get<Aapm[]>(`${API_CONFIG.baseUrl}/aapm`);
  }

  findAllByAluno(idAluno: number): Observable<Aapm[]> {
    return this.http.get<Aapm[]>(`${API_CONFIG.baseUrl}/aapm/aluno/${idAluno}`);
  }

  investimentoCreate(
    investimento: InvestimentoAapm
  ): Observable<InvestimentoAapm> {
    return this.http.post<InvestimentoAapm>(
      `${API_CONFIG.baseUrl}/aapm/investimento/create`,
      investimento
    );
  }

  investimentoDelete(id: number): Observable<InvestimentoAapm> {
    return this.http.delete<InvestimentoAapm>(
      `${API_CONFIG.baseUrl}/aapm/investimento/${id}`
    );
  }

  investimentoUpdate(
    id: number,
    investimento: InvestimentoAapm
  ): Observable<InvestimentoAapm> {
    return this.http.put<InvestimentoAapm>(
      `${API_CONFIG.baseUrl}/aapm/investimento/${id}`,
      investimento
    );
  }

  investimentoFindAll(): Observable<InvestimentoAapm[]> {
    return this.http.get<InvestimentoAapm[]>(
      `${API_CONFIG.baseUrl}/aapm/investimento`
    );
  }

  investimentoFindById(id: number): Observable<InvestimentoAapm> {
    return this.http.get<InvestimentoAapm>(
      `${API_CONFIG.baseUrl}/aapm/investimento/${id}`
    );
  }
}
