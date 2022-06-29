
import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";

import { Aluno } from "src/app/models/Aluno";
import { Curso } from "src/app/models/Curso";
import { AlunoService } from "src/app/services/aluno.service";
import { CursoService } from "src/app/services/curso.service";

@Component({
  selector: "app-egressos",
  templateUrl: "./egressos.component.html",
  styleUrls: ["./egressos.component.css"],
})
export class EgressosComponent implements OnInit {
  egressos: Aluno[];
  egressosFilter: Aluno[];
  idCursoSelected: number = 0;
  numeroTurmaSelected: number = 0;
  cursos: Curso[] = [];
  curso: Curso = {
    id: 0,
    modalidade: "",
    areaTecnologica: "Todos",
    turma: [],
    imagem: "",
  };
  totalAlunos: number;

  constructor(
    private cursoService: CursoService,
    private service: AlunoService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.findAll();
    this.findAllCursos();
  }

  findAll() {
    this.service.findAllByStatus("EGRESSO").subscribe(
      (response) => {
        this.egressos = response;
        this.applyFilter();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  findAllCursos() {
    this.cursoService.findAll().subscribe((response) => {
      this.cursos = response;
      this.cursos.push(this.curso);
    });
  }

  findAllByCurso() {
    if (this.idCursoSelected == 0) {
      this.findAll();
      this.applyFilter();
      return;
    }
    this.service
      .findAllByCurso(this.idCursoSelected, "EGRESSO")
      .subscribe((response) => {
        this.egressos = response;
        this.applyFilter();
      });
  }

  applyFilter() {
    var filterValue = <HTMLInputElement>document.getElementById("filter");
    if (filterValue.value == "") {
      this.egressosFilter = this.egressos;
    }
    this.egressosFilter = this.egressos.filter((aluno) => {
      if (this.numeroTurmaSelected == 0 || this.numeroTurmaSelected == null) {
        return aluno.nome
          .toLowerCase()
          .includes(filterValue.value.toLowerCase());
      } else {
        return (
          aluno.nome.toLowerCase().includes(filterValue.value.toLowerCase()) &&
          aluno.numeroTurma == this.numeroTurmaSelected
        );
      }
    });
    this.totalAlunos = this.egressosFilter.length;
  }
}
