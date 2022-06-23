import { MatDialog } from "@angular/material/dialog";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";

import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { Turma } from "src/app/models/Turma";
import { TurmaService } from "src/app/services/turma.service";
@Component({
  selector: "app-turma-create",
  templateUrl: "./turma-create.component.html",
  styleUrls: ["./turma-create.component.css"],
})
export class TurmaCreateComponent implements OnInit {
  turma: Turma = {
    id: "",
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

  listPeriodo: string[] = [
    "MANHA",
    "TARDE",
    "NOITE",
    "INTEGRAL",
    "SABADO",
    "FORMANDO",
    "EVADIDO",
  ];

  cursoId: number;

  constructor(
    private service: TurmaService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cursoId = parseInt(this.route.snapshot.paramMap.get("id"));
  }

  codigo: FormControl = new FormControl(null, Validators.required);
  entrada: FormControl = new FormControl(null, Validators.required);
  saida: FormControl = new FormControl(null, Validators.required);
  almocoEntrada: FormControl = new FormControl(null, Validators.required);
  almocoSaida: FormControl = new FormControl(null, Validators.required);
  toleranciaEntrada: FormControl = new FormControl(null, Validators.required);
  toleranciaSaida: FormControl = new FormControl(null, Validators.required);
  periodo: FormControl = new FormControl(null, Validators.required);

  validaCampos(): boolean {
    return (
      this.codigo.valid &&
      this.entrada.valid &&
      this.saida.valid &&
      this.almocoEntrada &&
      this.almocoSaida &&
      this.toleranciaEntrada.valid &&
      this.toleranciaSaida.valid &&
      this.periodo.valid
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

  create(): void {
    this.service.create(this.cursoId, this.turma).subscribe(
      () => {
        this.toast.success("Turma cadastrada com sucesso!", "Create");
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
