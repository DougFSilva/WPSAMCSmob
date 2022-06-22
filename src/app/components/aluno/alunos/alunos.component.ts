import { MatDialog } from "@angular/material/dialog";
import { AlunoService } from "./../../../services/aluno.service";
import { Component, OnInit } from "@angular/core";
import { Toast, ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Aluno } from "src/app/models/Aluno";
import { DialogComponent } from "../../dialog/dialog.component";

@Component({
  selector: "app-alunos",
  templateUrl: "./alunos.component.html",
  styleUrls: ["./alunos.component.css"],
})
export class AlunosComponent implements OnInit {
  alunos: Aluno[];
  alunosFilter: Aluno[];
  filtrarPor: string = "nome";
  totalAlunos: number;

  constructor(
    private toast: ToastrService,
    private service: AlunoService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.findAllAtivos();
  }

  findAllAtivos() {
    this.service.findAllByStatus("ATIVO").subscribe(
      (response) => {
        this.alunos = response;
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
      } else {
        return;
      }
    });
  }

  deleteById(id: number) {
    this.service.deleteById(id).subscribe(
      () => {
        this.toast.success("Aluno deletado com sucesso!", "Delete");
        this.findAllAtivos();
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

  applyFilter() {
    var filterValue = <HTMLInputElement>document.getElementById("filter");
    if (filterValue.value == "") {
      this.alunosFilter = this.alunos;
    } else {
      if (this.filtrarPor == "nome") {
        this.alunosFilter = this.alunos.filter((aluno) => {
          if (aluno.nome != null) {
            return aluno.nome
              .toLowerCase()
              .includes(filterValue.value.toLowerCase());
          }
          return false;
        });
      } else if (this.filtrarPor == "tag") {
        this.alunosFilter = this.alunos.filter((aluno) => {
          if (aluno.tag != null) {
            return aluno.tag
              .toString()
              .includes(filterValue.value.toLowerCase());
          }
          return false;
        });
      } else if (this.filtrarPor == "matricula") {
        this.alunosFilter = this.alunos.filter((aluno) => {
          if (aluno.matricula != null) {
            return aluno.matricula
              .toString()
              .includes(filterValue.value.toLowerCase());
          }
          return false;
        });
      }
    }
    this.totalAlunos = this.alunosFilter.length;
  }

  isPresent(entradaSaida) {
    if (entradaSaida == "SAIDA" || entradaSaida == "ALMOCO_SAIDA") {
      return true;
    } else {
      return false;
    }
  }
}
