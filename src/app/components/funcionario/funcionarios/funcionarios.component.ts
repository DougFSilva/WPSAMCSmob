import { UsuarioService } from './../../../services/usuario.service';
import { DialogComponent } from "./../../dialog/dialog.component";
import { Funcionario } from "./../../../models/Funcionario";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { FuncionarioService } from "./../../../services/funcionario.service";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-funcionarios",
  templateUrl: "./funcionarios.component.html",
  styleUrls: ["./funcionarios.component.css"],
})
export class FuncionariosComponent implements OnInit {
  perfilUsuario: string;
  funcionarios: Funcionario[] = [];
  funcionariosFilter: Funcionario[] = [];
  filtrarPor: string = "nome";
  totalFuncionarios: number = 0;

  constructor(
    private service: FuncionarioService,
    private toast: ToastrService,
    private usuarioService: UsuarioService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.perfilUsuario = this.usuarioService.getPerfilUsuario();
    this.findAll();
  }

  findAll(): void {
    this.service.findAll().subscribe(
      (response) => {
        this.funcionarios = response;
        this.applyFilter();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  deleteByIdDialog(id: number): void {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.deleteByid(id);
      }
    });
  }

  deleteByid(id: number): void {
    this.service.deleteById(id).subscribe(
      (response) => {
        this.toast.success("Funcionario deletado com sucesso", "Delete");
        this.findAll();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  applyFilter() {
    var filterValue = <HTMLInputElement>document.getElementById("filter");
    if (filterValue.value == "") {
      this.funcionariosFilter = this.funcionarios;
    } else {
      if (this.filtrarPor == "nome") {
        this.funcionariosFilter = this.funcionarios.filter((funcionario) => {
          if (funcionario.nome != null) {
            return funcionario.nome
              .toLowerCase()
              .includes(filterValue.value.toLowerCase());
          }
          return false;
        });
      } else if (this.filtrarPor == "tag") {
        this.funcionariosFilter = this.funcionarios.filter((aluno) => {
          if (aluno.tag != null) {
            return aluno.tag
              .toString()
              .includes(filterValue.value.toLowerCase());
          }
          return false;
        });
      } else if (this.filtrarPor == "matricula") {
        this.funcionariosFilter = this.funcionarios.filter((funcionario) => {
          if (funcionario.matricula != null) {
            return funcionario.matricula
              .toString()
              .includes(filterValue.value.toLowerCase());
          }
          return false;
        });
      }
    }
    this.totalFuncionarios = this.funcionariosFilter.length;
  }
}
