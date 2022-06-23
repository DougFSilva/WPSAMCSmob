
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { MatTableDataSource } from "@angular/material/table";

import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { Usuario } from "src/app/models/Usuario";
import { UsuarioService } from "src/app/services/usuario.service";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.css"],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuario: Usuario = {
    id: null,
    nome: "",
    empresa: "",
    username: "",
    perfis: [
      {
        tipo: "",
      },
    ],
  };

  ELEMENT_DATA: Usuario[] = [];
  displayedColumns: string[] = [
    "nome",
    "empresa",
    "username",
    "perfis",
    "acao",
  ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  constructor(
    private service: UsuarioService,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.service.findAll().subscribe(
      (response) => {
        this.ELEMENT_DATA = response;
        console.log(response);
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  deleteByIdDialog(id: number): void {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe(
      (response) => {
        console.log(response);
        if (response == "true") this.deleteById(id);
        return;
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
        return;
      }
    );
  }

  deleteById(id: number): void {
    this.service.deleteById(id).subscribe(
      () => {
        this.toast.success("Usuário deletado com sucesso!", "Delete");
        this.findAll();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
