import { ToastrService } from "ngx-toastr";
import { TurmaService } from "./../../../services/turma.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Turma } from "src/app/models/Turma";

@Component({
  selector: "app-turmas",
  templateUrl: "./turmas.component.html",
  styleUrls: ["./turmas.component.css"],
})
export class TurmasComponent implements OnInit {
  turmas: Turma[] = [];
  turmaFilter: Turma[] = [];

  constructor(private toast: ToastrService, private service: TurmaService) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.service.findAll().subscribe(
      (response) => {
        this.turmas = response;
        this.applyFilter();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  applyFilter() {
    var filterValue = <HTMLInputElement>document.getElementById("filter");
    if (filterValue.value == "") {
      this.turmaFilter = this.turmas;
    }
    this.turmaFilter = this.turmas.filter((turma) => {
      return turma.codigo
        .toLowerCase()
        .includes(filterValue.value.toLowerCase());
    });
  }
}
