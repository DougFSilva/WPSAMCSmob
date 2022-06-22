import { PontoFuncionario } from './../models/PontoFuncionario';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class PontoFuncionarioService {

  constructor(private http: HttpClient) { }

  findAllByFuncionarioId(id:number): Observable<PontoFuncionario[]>{
    return this.http.get<PontoFuncionario[]>(`${API_CONFIG.baseUrl}/pontoFuncionario/${id}`)
  }
}
