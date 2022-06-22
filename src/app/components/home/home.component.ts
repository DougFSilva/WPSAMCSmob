import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { Aluno } from "src/app/models/Aluno";
import { CursoService } from "src/app/services/curso.service";
import { AlunoService } from "src/app/services/aluno.service";
import { BaseChartDirective } from "ng2-charts";
import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from "chart.js";
import DataLabelsPlugin from "chartjs-plugin-datalabels";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;
  sexoMasculino: number = 0;
  sexoFeminino: number = 0;
  totalAlunos: number = 0;
  alunosDentroDaEscola: number = 0;
  alunos: Aluno[] = [];

  //------------Alunos por cidade
  public cidadeChartLabels: string[] = [];
  public cidadeChartData: ChartData<"doughnut"> = {
    labels: this.cidadeChartLabels,
    datasets: [{ data: [] }],
  };
  public cidadeChartType: ChartType = "doughnut";

  //------------Alunos por sexo
  public sexoChartLabels: string[] = ["Feminino", "Masculino"];
  public sexoChartData: ChartData<"doughnut"> = {
    labels: this.sexoChartLabels,
    datasets: [{ data: [this.sexoFeminino, this.sexoMasculino] }],
  };
  public sexoChartType: ChartType = "doughnut";

  //------------Alunos por curso
  public cursoChartLabels: string[] = [];
  public cursoChartData: ChartData<"doughnut"> = {
    labels: this.cursoChartLabels,
    datasets: [{ data: [] }],
  };
  public cursoChartType: ChartType = "doughnut";

  //------------Alunos por empresa
  public empresaBarChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 1,
      },
    },

    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "end",
      },
    },
  };
  public empresaBarChartType: ChartType = "bar";
  public empresaBarChartPlugins = [DataLabelsPlugin];

  public empresaBarChartData: ChartData<"bar"> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: "lightSkyBlue" }],
  };

  //------------Alunos por idade
  public idadeBarChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 1,
      },
    },

    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "end",
      },
    },
  };
  public idadeBarChartType: ChartType = "bar";
  public idadeBarChartPlugins = [DataLabelsPlugin];

  public idadeBarChartData: ChartData<"bar"> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: "lightSkyBlue" }],
  };
  ELEMENT_DATA: Aluno[] = [];
  displayedColumns: string[] = ["turma", "nome", "idade"];
  aniversariantesDataSource = new MatTableDataSource(this.ELEMENT_DATA);

  constructor(
    private alunosService: AlunoService,
    private cursoService: CursoService,
    private toast: ToastrService
  ) {}
  ngOnInit(): void {
    this.getAlunos();
  }

  async getAlunos() {
    await this.alunosService.findAllByStatusLazy("ATIVO").subscribe(
      (response) => {
        this.alunos = response;
        this.getAlunoPorSexo();
        this.getAlunosPorCidade();
        this.getAlunosDentroDaEscola();
        this.getAlunosPorCurso();
        this.getAlunosPorEmpresa();
        this.getAlunosPorIdade();
        this.getAniversariantes();
        this.totalAlunos = this.alunos.length;
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }
  getAlunoPorSexo(): void {
    this.alunos.forEach((aluno) => {
      if (aluno.sexo === "M") {
        this.sexoMasculino = this.sexoMasculino + 1;
      } else if (aluno.sexo === "F") {
        this.sexoFeminino = this.sexoFeminino + 1;
      }
    });
    this.sexoChartData.datasets[0].data = [
      this.sexoFeminino,
      this.sexoMasculino,
    ];

    this.chartUpdate();
  }

  getAlunosPorCidade(): void {
    let cidades: string[] = [];
    let cidadesValues = {};
    this.alunos.forEach((aluno) => {
      if (aluno.cidade != null) {
        cidades.push(aluno.cidade);
      }
    });
    cidades.forEach((cidade) => {
      if (!this.cidadeChartLabels.includes(cidade)) {
        this.cidadeChartLabels.push(cidade);
      }
      cidadesValues[cidade] = cidadesValues[cidade] + 1 || 1;
    });
    this.cidadeChartLabels.forEach((cidade) => {
      this.cidadeChartData.datasets[0].data.push(cidadesValues[cidade]);
    });
    this.chartUpdate();
  }

  getAlunosPorCurso(): void {
    let cursos: string[] = [];
    let cursosValues = {};
    this.alunos.forEach((aluno) => {
      cursos.push(aluno.curso);
    });
    cursos.forEach((curso) => {
      if (!this.cursoChartLabels.includes(curso)) {
        this.cursoChartLabels.push(curso);
      }
      cursosValues[curso] = cursosValues[curso] + 1 || 1;
    });
    this.cursoChartLabels.forEach((curso) => {
      this.cursoChartData.datasets[0].data.push(cursosValues[curso]);
    });
    this.chartUpdate();
  }

  getAlunosPorEmpresa(): void {
    let empresas: string[] = [];
    let empresasValues = {};
    let empresasKeys: string[] = [];
    this.alunos.forEach((aluno) => {
      if (
        aluno.empresa != null &&
        aluno.empresa.toUpperCase() != "SEM EMPRESA"
      ) {
        empresas.push(aluno.empresa.toUpperCase());
      }
    });
    empresas.forEach((empresa) => {
      if (!this.empresaBarChartData.labels.includes(empresa)) {
        empresasKeys.push(empresa);
        this.empresaBarChartData.labels.push(empresa);
      }
      empresasValues[empresa] = empresasValues[empresa] + 1 || 1;
    });
    empresasKeys.forEach((empresa) => {
      this.empresaBarChartData.datasets[0].data.push(empresasValues[empresa]);
    });
    this.chartUpdate();
  }

  getAlunosPorIdade(): void {
    let idades: string[] = [];
    let idadesValues = {};
    let idadesKeys: string[] = [];

    this.alunos.forEach((aluno) => {
      aluno.idade = this.getIdade(aluno.dataNascimento);
      if (aluno.idade != null) {
        idades.push(aluno.idade);
      }
    });
    idades = idades.sort();
    idades.forEach((idade) => {
      if (!this.idadeBarChartData.labels.includes(idade)) {
        idadesKeys.push(idade);
        this.idadeBarChartData.labels.push(idade);
      }
      idadesValues[idade] = idadesValues[idade] + 1 || 1;
    });
    idadesKeys.forEach((empresa) => {
      this.idadeBarChartData.datasets[0].data.push(
        parseInt(idadesValues[empresa])
      );
    });
    this.chartUpdate();
  }

  getAniversariantes(): void {
    let dateNow = new Date();
    this.alunos.forEach((aluno) => {
      let birthday = new Date(aluno.dataNascimento);
      if (
        dateNow.getDate() === birthday.getDate() + 1 &&
        dateNow.getMonth() === birthday.getMonth()
      ) {
        this.ELEMENT_DATA.push(aluno);
      }
    });
    this.aniversariantesDataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  getAlunosDentroDaEscola(): void {
    this.alunos.forEach((aluno) => {
      if (
        aluno.entradaSaida === "SAIDA" ||
        aluno.entradaSaida === "ALMOCO_SAIDA"
      ) {
        this.alunosDentroDaEscola = this.alunosDentroDaEscola + 1;
      }
    });
  }

  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {}

  chartUpdate(): void {
    this.charts.forEach((child) => {
      child.chart.update();
    });
  }

  getIdade(birthdate: string): string {
    let birthdateSplit = birthdate.split("-");
    const today = new Date().toLocaleDateString("en-CA").split("-");
    let yearsDiff = parseInt(today[0]) - parseInt(birthdateSplit[0]);
    if (
      parseInt(today[1]) > parseInt(birthdateSplit[1]) ||
      (parseInt(today[1]) == parseInt(birthdateSplit[1]) &&
        parseInt(today[2]) >= parseInt(birthdateSplit[2]))
    ) {
      return yearsDiff.toString();
    }
    return (yearsDiff - 1).toString();
  }
}
