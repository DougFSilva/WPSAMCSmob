import { UsuarioLogado } from './../models/UsuarioLogado';
import { API_CONFIG } from '../config/api.config';
import { Autenticacao } from '../models/Autenticacao';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioLogado: UsuarioLogado;
  jwtService:JwtHelperService = new JwtHelperService;

  constructor(private http: HttpClient) { }

  authenticate(auth : Autenticacao){
    return this.http.post<UsuarioLogado>(`${API_CONFIG.baseUrl}/auth`, auth, {
        observe: 'body',
        responseType: 'json',
    })
  }

  successfullLogin(usuarioLogado : UsuarioLogado){
    localStorage.setItem('token', usuarioLogado.token);
    localStorage.setItem('usuario', usuarioLogado.usuario);
    localStorage.setItem('perfis', usuarioLogado.perfis.toString());

  }

  isAuthenticated(){
    let token = localStorage.getItem("token")
    if(token != null){
      return ! this.jwtService.isTokenExpired(token)
    }
    return false;
  }

  logout(){
    localStorage.clear();
  }

}
