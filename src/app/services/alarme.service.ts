import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../config/api.config";
import { Alarm } from "../models/Alarm";
import { NumberFormat } from "xlsx";
@Injectable({
  providedIn: "root",
})
export class AlarmeService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Alarm[]> {
    return this.http.get<Alarm[]>(`${API_CONFIG.baseUrl}/alarm`);
  }

  deleteById(id: number): Observable<Alarm> {
    return this.http.delete<Alarm>(`${API_CONFIG.baseUrl}/alarm/${id}`);
  }

  deleteAll(): Observable<Alarm> {
    return this.http.delete<Alarm>(`${API_CONFIG.baseUrl}/alarm`);
  }

  updateStatus(id: NumberFormat, status: boolean): Observable<Alarm> {
    return this.http.put<Alarm>(
      `${API_CONFIG.baseUrl}/alarm/${id}/status/${status}`,
      null
    );
  }
}
