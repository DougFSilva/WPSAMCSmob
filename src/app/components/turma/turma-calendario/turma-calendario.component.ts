import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";

import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { Turma } from "src/app/models/Turma";
import { AulaFORM } from "src/app/models/AulaFORM";
import { Aula } from "src/app/models/Aula";
import { TurmaService } from "src/app/services/turma.service";
import { AulaService } from "src/app/services/aula.service";


export class checkDay {
  checkSeg: boolean;
  checkTer: boolean;
  checkQua: boolean;
  checkQui: boolean;
  checkSex: boolean;
  checkSab: boolean;
}

@Component({
  selector: "app-turma-calendario",
  templateUrl: "./turma-calendario.component.html",
  styleUrls: ["./turma-calendario.component.css"],
})
export class TurmaCalendarioComponent implements OnInit {
  meses: string[] = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  datesString: string[] = [];
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
  turmas: Turma[] = [];
  turmaSelectedId: number;
  turmaSelected: Turma = {
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
  dates: Date[] = [];
  aulasFORM: AulaFORM[] = [];
  aulas: Aula[] = [];
  startDate: Date;
  endDate: Date;
  checkSeg: boolean = false;
  checkTer: boolean = false;
  checkQua: boolean = false;
  checkQui: boolean = false;
  checkSex: boolean = false;
  checkSab: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    private AulaService: AulaService,
    private location: Location,
    private turmaService: TurmaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.findTurmaById(parseInt(this.route.snapshot.paramMap.get("id")));
    this.aulas = this.route.snapshot.data["aulas"];
    this.aulas.forEach((aula) => {
      let date = new Date(aula.diaAula);
      date.setDate(date.getDate() + 1);
      this.dates.push(date);
    });
    this.findAllTurmas();
  }

  findTurmaById(id: number): void {
    this.turmaService.findById(id).subscribe(
      (response) => {
        this.turma = response;
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  findAllTurmas(): void {
    this.turmaService.findAll().subscribe((response) => {
      response.forEach(
        (res) => {
          if (
            !res.codigo.includes("EGRESSO") &&
            !res.codigo.includes("DESISTENTE")
          ) {
            this.turmas.push(res);
          }
        },
        (ex) => {
          this.toast.error(ex.error.error, "Error");
        }
      );
    });
  }

  createDialog() {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.create();
      }
        return;
    });
  }

  create(): void {
    this.aulasFORM = [];
    if (this.dates != null) {
      this.dates.forEach((date) => {
        this.aulasFORM.push(new AulaFORM(date.toLocaleDateString("en-CA")));
      });

      this.AulaService.createAll(this.turma.id, this.aulasFORM).subscribe(
        () => {
          this.toast.success("Aulas editadas com sucesso!", "Create");
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
    } else {
      this.AulaService.createAll(this.turma.id, this.aulasFORM).subscribe(
        () => {
          this.toast.success("Aulas editadas com sucesso!", "Create");
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
  }

  deleteDialog(idTurma: number) {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.delete(idTurma);
      } else {
        return;
      }
    });
  }

  delete(idTurma: number) {
    this.dates = [];
  }

  addStartDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.startDate = event.value;
  }

  addEndDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.endDate = event.value;
  }

  addDays() {
    this.dates.forEach((date) => {
      this.datesString.push(date.toDateString());
    });

    if (this.checkSeg) {
      this.addDaysSave(1);
    }
    if (this.checkTer) {
      this.addDaysSave(2);
    }
    if (this.checkQua) {
      this.addDaysSave(3);
    }
    if (this.checkQui) {
      this.addDaysSave(4);
    }
    if (this.checkSex) {
      this.addDaysSave(5);
    }
    if (this.checkSab) {
      this.addDaysSave(6);
    }

    this.dates = [];
    this.datesString.forEach((date) => {
      this.dates.push(new Date(date));
    });
    this.datesString = [];
  }

  addDaysSave(dayOfWeek: number) {
    const startDateConst: Date = new Date(this.startDate.toDateString());

    while (this.startDate <= this.endDate) {
      if (!this.datesString.includes(this.startDate.toDateString())) {
        if (this.startDate.getDay() === dayOfWeek) {
          this.datesString.push(this.startDate.toDateString());
        }
      } else {
      }
      this.startDate.setDate(this.startDate.getDate() + 1);
    }
    this.startDate = startDateConst;
  }

  copy() {
    this.turmaService.findById(this.turmaSelectedId).subscribe((response) => {
      this.turmaSelected = response;
      if (this.turmaSelected) {
        this.dates = [];
        this.turmaSelected.aulas.forEach(
          (aula) => {
            let date = new Date(aula.diaAula);
            date.setDate(date.getDate() + 1);
            this.dates.push(date);
          },
          (ex) => {
            this.toast.error(ex.error.error, "Error");
          }
        );
      }
    });
  }

  return(): void {
    this.location.back();
  }
}
