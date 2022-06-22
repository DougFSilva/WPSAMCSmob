import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";

import { UploadFilesComponent } from "src/app/components/upload-files/upload-files.component";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { Curso } from "src/app/models/Curso";
import { UsuarioService } from 'src/app/services/usuario.service';
import { CursoService } from "src/app/services/curso.service";
@Component({
  selector: "app-cursos",
  templateUrl: "./cursos.component.html",
  styleUrls: ["./cursos.component.css"],
})
export class CursosComponent implements OnInit {
  perfilUsuario: string;
  cursos: Curso[] = [];
  cursosFilter: Curso[] = [];
  constructor(
    private service: CursoService,
    private toast: ToastrService,
    private usuarioService: UsuarioService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.perfilUsuario = this.usuarioService.getPerfilUsuario()
    this.findAll();
  }

  findAll() {
    this.service.findAll().subscribe(
      (response) => {
        this.cursos = response;
        this.applyFilter();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  deleteByIdDialog(id: number) {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.deleteById(id);
      }
        return;
    });
  }

  deleteById(id: number): void {
    this.service.deleteById(id).subscribe(
      (response) => {
        this.toast.success("Curso deletado com sucesso!", "Delete");
        this.findAll();
      },
      (ex) => {
        if (ex.status === 403) {
          this.toast.error(
            "Você não tem autorização para essa operação",
            "Error"
          );
          return;
        }
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  imageUpload(id: number): void {
    let dialog = this.dialog.open(UploadFilesComponent, {
      data: { folder: "cursos", name: id },
    });
    dialog.afterClosed().subscribe((response) => {
      if (response) {
        this.findAll();
      }
    });
  }

  applyFilter() {
    var filterValue = <HTMLInputElement>document.getElementById("filter");
    if (filterValue.value == "") {
      this.cursosFilter = this.cursos;
    }
    this.cursosFilter = this.cursos.filter((curso) => {
      if (curso.areaTecnologica != null) {
        return curso.areaTecnologica
          .toLowerCase()
          .includes(filterValue.value.toLowerCase());
      }
      return false;
    });
  }
}
