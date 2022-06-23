
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { FormControl, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { AlunoFORM } from "src/app/models/AlunoFORM";
import { Turma } from "src/app/models/Turma";
import { AlunoService } from "src/app/services/aluno.service";
import { TurmaService } from "src/app/services/turma.service";


@Component({
  selector: "app-aluno-create",
  templateUrl: "./aluno-create.component.html",
  styleUrls: ["./aluno-create.component.css"],
})
export class AlunoCreateComponent implements OnInit {
  aluno: AlunoFORM = {
    id: "",
    nome: "",
    sexo: "",
    idade: null,
    cidade: "",
    rg: "",
    dataNascimento: "",
    email: "",
    telefone: "",
    turma: "",
    numeroTurma: null,
    matricula: null,
    dataMatricula: "",
    empresa: "",
    tag: null,
  };

  turmas: Turma[] = [];

  nome: FormControl = new FormControl(null, Validators.minLength(3));
  sexo: FormControl = new FormControl(null, Validators.minLength(1));
  rg: FormControl = new FormControl(null, [
    Validators.minLength(8),
    Validators.maxLength(10),
  ]);
  dataNascimento: FormControl = new FormControl(null, Validators.required);
  turma: FormControl = new FormControl(null, Validators.required);
  matricula: FormControl = new FormControl(null, Validators.minLength(5));
  dataMatricula: FormControl = new FormControl(null, Validators.required);
  empresa: FormControl = new FormControl(null, Validators.minLength(3));

  constructor(
    private turmaService: TurmaService,
    private service: AlunoService,
    private toast: ToastrService,
    private router: Router,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.findAllTurmas();
  }

  validaCampos(): boolean {
    return (
      this.nome.valid &&
      this.sexo.valid &&
      this.rg.valid &&
      this.dataNascimento.valid &&
      this.turma.valid &&
      this.matricula.valid &&
      this.dataMatricula.valid &&
      this.empresa.valid
    );
  }

  createDialog() {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.create();
      } else {
        return;
      }
    });
  }

  create() {
    this.service.create(this.aluno).subscribe(
      () => {
        this.toast.success("Aluno cadastrado com sucesso!", "Create");
        this.location.back();
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

  findAllTurmas() {
    this.turmaService.findAll().subscribe(
      (response) => {
        response.forEach((res) => {
          if (
            !res.codigo.includes("FORMANDO") &&
            !res.codigo.includes("EVADIDO")
          ) {
            this.turmas.push(res);
          }
        });
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  return(): void {
    this.location.back();
  }
}
