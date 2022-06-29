import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { Turma } from "src/app/models/Turma";
import { TurmaService } from "src/app/services/turma.service";

@Component({
  selector: "app-turma-update",
  templateUrl: "./turma-update.component.html",
  styleUrls: ["./turma-update.component.css"],
})
export class TurmaUpdateComponent implements OnInit {
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
    "EGRESSO",
    "EVADIDO",
  ];

  idTurma: number;

  constructor(
    private service: TurmaService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.idTurma = parseInt(this.route.snapshot.paramMap.get("id"));
    this.findById();
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

  findById() {
    return this.service.findById(this.idTurma).subscribe(
      (response) => {
        this.turma = response;
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
    this.service.update(this.idTurma, this.turma).subscribe(
      (response) => {
        this.turma = response;
        this.toast.success("Turma editada com sucesso", "Update");
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
