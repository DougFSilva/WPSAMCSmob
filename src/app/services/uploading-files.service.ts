import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../config/api.config";

@Injectable({
  providedIn: "root",
})
export class UploadingFilesService {
  constructor(private http: HttpClient, private toast: ToastrService) {}

  uploadFile(file: FormData, folder: string, name: string) {
    this.http
      .post(`${API_CONFIG.baseUrl}/upload/${folder}/${name}`, file)
      .subscribe(
        (response) => {
          this.toast.success("Arquivo enviado com sucesso", "Upload");
        },
        (ex) => {
          this.toast.error(ex.error.error, "Error");
        }
      );
  }
}
