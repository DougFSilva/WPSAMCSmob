import { MatDialog } from "@angular/material/dialog";
import { AlunoFORM } from "../../../models/AlunoFORM";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Turma } from "src/app/models/Turma";
import { AlunoService } from "src/app/services/aluno.service";
import { TurmaService } from "src/app/services/turma.service";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";
import { DialogComponent } from "../../dialog/dialog.component";

@Component({
  selector: "app-aluno-update",
  templateUrl: "./aluno-update.component.html",
  styleUrls: ["./aluno-update.component.css"],
})
export class AlunoUpdateComponent implements OnInit {
  aluno: AlunoFORM = {
    id: "",
    nome: "",
    sexo: "",
    idade: 0,
    cidade: "",
    rg: "",
    dataNascimento: "",
    email: "",
    telefone: "",
    turma: "",
    numeroTurma: null,
    matricula: 0,
    dataMatricula: "",
    empresa: "",
    tag: 0,
  };

  turmas: Turma[] = [];

  nome: FormControl = new FormControl(null, Validators.minLength(3));
  sexo: FormControl = new FormControl(null, Validators.minLength(1));
  rg: FormControl = new FormControl(null, Validators.minLength(8));
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
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.aluno.id = this.route.snapshot.paramMap.get("id");
    this.findAllTurmas();
    this.findById();
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

  findById(): void {
    this.service.findById(this.aluno.id).subscribe(
      (response) => {
        this.aluno = response;
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  findAllTurmas(): void {
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

  updateDialog() {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.update();
      } else {
        return;
      }
    });
  }

  update(): void {
    this.service.update(this.aluno).subscribe(
      (response) => {
        this.toast.success(
          `Aluno ${response.nome} editado com sucesso!`,
          "Update"
        );
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

  return(): void {
    this.location.back();
  }
}
