import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../config/api.config";
import { Usuario } from "../models/Usuario";
import { UsuarioFORM } from "../models/UsuarioFORM";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  constructor(private http: HttpClient) {}

  create(usuarioFORM: UsuarioFORM): Observable<Usuario> {
    return this.http.post<Usuario>(
      `${API_CONFIG.baseUrl}/usuario/create`,
      usuarioFORM
    );
  }

  deleteById(id: number): Observable<Usuario> {
    return this.http.delete<Usuario>(`${API_CONFIG.baseUrl}/usuario/${id}`);
  }

  updateById(id: number, usuarioFORM: UsuarioFORM): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${API_CONFIG.baseUrl}/usuario/${id}`,
      usuarioFORM
    );
  }

  findAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${API_CONFIG.baseUrl}/usuario`);
  }

  findById(id: number): Observable<UsuarioFORM> {
    return this.http.get<UsuarioFORM>(`${API_CONFIG.baseUrl}/usuario/${id}`);
  }

  getUsuario():string{
    return localStorage.getItem("usuario");
  }

  getPerfilUsuario():string{
    const perfil = localStorage.getItem("perfis");
    if (perfil.includes("ADMIN")) {
      return "ADMIN";
    } else if (perfil.includes("OPERATOR")) {
      return "OPERATOR";
    } else if (perfil.includes("USER")) {
      return "USER";
    }
    return null;
  }
}
