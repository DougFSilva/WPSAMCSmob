import { MatDialog } from "@angular/material/dialog";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { Turma } from "src/app/models/Turma";
import { Aluno } from "src/app/models/Aluno";
import { TurmaService } from "src/app/services/turma.service";
import { AlunoService } from "src/app/services/aluno.service";
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: "app-aluno-turma",
  templateUrl: "./aluno-turma.component.html",
  styleUrls: ["./aluno-turma.component.css"],
})
export class AlunoTurmaComponent implements OnInit {
  perfilUsuario:string;
  alunos: Aluno[];
  alunosFilter: Aluno[];
  filtrarPor: string = "nome";
  idTurma: number;
  turma: Turma = {
    id: null,
    codigo: "",
    curso: "",
    entrada: "",
    saida: "",
    almocoEntrada: "",
    almocoSaida: "",
    toleranciaEntrada: null,
    toleranciaSaida: null,
    periodo: "",
    aulas: [],
    imagem: "",
  };
  totalAlunos: number = null;

  constructor(
    private toast: ToastrService,
    private service: AlunoService,
    private turmaService: TurmaService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.perfilUsuario = this.usuarioService.getPerfilUsuario();
    this.idTurma = parseInt(this.route.snapshot.paramMap.get("idTurma"));
    this.findTurmaById();
    this.findByTurmaId();
  }

  findTurmaById(): void {
    this.turmaService.findById(this.idTurma).subscribe(
      (response) => {
        this.turma = response;
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  findByTurmaId(): void {
    this.service.findByTurmaId(this.idTurma).subscribe(
      (response) => {
        this.alunos = response;
        this.applyFilter();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  acessoTemporarioDialog(desbloqueio: boolean): void {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.acessoTemporario(desbloqueio);
      } else {
        return;
      }
    });
  }

  acessoTemporario(desbloqueio: boolean): void {
    let contDialog = 0;
    this.alunos.forEach(
      (aluno) => {
        this.service
          .updateDesbloqueioTemporario(aluno.id, desbloqueio)
          .subscribe((response) => {
            if (contDialog == 0) {
              if (desbloqueio === true) {
                this.toast.success(
                  "Acesso temporário liberado com sucesso!",
                  "Update"
                );
              } else {
                this.toast.success(
                  "Acesso temporário bloqueado com sucesso!",
                  "Update"
                );
              }
            }
            contDialog = 1;
          });
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
        this.findByTurmaId();
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
