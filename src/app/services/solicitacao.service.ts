import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Solicitacao } from '../models/Solicitacao';
import { API_CONFIG } from '../config/api.config';
import { SolicitacaoFORM } from '../models/SolicitacaoFORM';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {

  constructor(private http: HttpClient) { }

  create(solicitacaoFORM:SolicitacaoFORM, idAluno: number):Observable<Solicitacao>{
    return this.http.post<Solicitacao>(`${API_CONFIG.baseUrl}/solicitacao/create/aluno/${idAluno}`,solicitacaoFORM)
  }

  deleteById(id: number):Observable<Solicitacao>{
    return this.http.delete<Solicitacao>(`${API_CONFIG.baseUrl}/solicitacao/${id}`)
  }

  updateById(solicitacaoFORM: SolicitacaoFORM, id: number):Observable<Solicitacao>{
    return this.http.put<Solicitacao>(`${API_CONFIG.baseUrl}/solicitacao/${id}`,solicitacaoFORM)
  }

  deleteAll():Observable<Solicitacao>{
    return this.http.delete<Solicitacao>(`${API_CONFIG.baseUrl}/solicitacao`)
  }

  updateStatus(id: number, status: boolean):Observable<Solicitacao>{
    return this.http.put<Solicitacao>(`${API_CONFIG.baseUrl}/solicitacao/${id}/${status}`, null)
  }

  findAll():Observable<Solicitacao[]>{
    return this.http.get<Solicitacao[]>(`${API_CONFIG.baseUrl}/solicitacao`)
  }

  findById(id: number): Observable<Solicitacao>{
    return this.http.get<Solicitacao>(`${API_CONFIG.baseUrl}/solicitacao/${id}`)
  }
}
