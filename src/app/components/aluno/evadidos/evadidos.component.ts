import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Aluno } from "src/app/models/Aluno";
import { Curso } from "src/app/models/Curso";
import { AlunoService } from "src/app/services/aluno.service";
import { CursoService } from "src/app/services/curso.service";

@Component({
  selector: "app-evadidos",
  templateUrl: "./evadidos.component.html",
  styleUrls: ["./evadidos.component.css"],
})
export class EvadidosComponent implements OnInit {
  evadidos: Aluno[];
  evadidosFilter: Aluno[];
  idCursoSelected: number = 0;
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
    this.service.findAllByStatus("EVADIDO").subscribe(
      (response) => {
        this.evadidos = response;
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
      .findAllByCurso(this.idCursoSelected, "EVADIDO")
      .subscribe((response) => {
        this.evadidos = response;
        this.applyFilter();
      });
  }

  applyFilter() {
    var filterValue = <HTMLInputElement>document.getElementById("filter");
    if (filterValue.value == "") {
      this.evadidosFilter = this.evadidos;
    }
    this.evadidosFilter = this.evadidos.filter((aluno) => {
      return aluno.nome.toLowerCase().includes(filterValue.value.toLowerCase());
    });
    this.totalAlunos = this.evadidosFilter.length;
  }
}
