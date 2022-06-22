import { RelatorioPagamentosComponent } from './../relatorio-pagamentos/relatorio-pagamentos.component';
import { RelatorioInvestimentosComponent } from './../relatorio-investimentos/relatorio-investimentos.component';
import { InvestimentoUpdateComponent } from './../investimento-update/investimento-update.component';
import { DialogComponent } from './../../dialog/dialog.component';
import { InvestimentoCreateComponent } from './../investimento-create/investimento-create.component';
import { MatDialog } from '@angular/material/dialog';
import { InvestimentoAapm } from './../../../models/InvestimentoAapm';
import { AlunoService } from 'src/app/services/aluno.service';
import { ToastrService } from 'ngx-toastr';
import { AapmService } from 'src/app/services/aapm.service';
import { Aapm } from 'src/app/models/Aapm';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Aluno } from 'src/app/models/Aluno';
import { MatTableDataSource } from '@angular/material/table';
import html2canvas from 'html2canvas';

export class TurmasPagantesCont {
  turma: string
  contagem: number

  constructor(turma: string, contagem: number){
    this.turma = turma
    this.contagem = contagem
  }
}


@Component({
  selector: 'app-dashboard-aapm',
  templateUrl: './dashboard-aapm.component.html',
  styleUrls: ['./dashboard-aapm.component.css']
})
export class DashboardAapmComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;

  turmasPagantesCont: TurmasPagantesCont[] = []
  startDate: string = new Date(new Date().getFullYear(),0,1).toLocaleDateString('en-CA')
  endDate:string = new Date().toLocaleDateString('en-CA')
  totalArrecadado: number = 0
  totalInvestido: number = 0
  balanco: number = 0
  pagamentos: number = 0
  alunosPagantes: number = 0
  totalAlunos: number = 0
  pagantesSemestre: number[] = [0,0,0,0]
  aapms: Aapm[] = []
  aapmsFilter: Aapm[] = []
  alunos: Aluno[] = []
  chartsUrl:any

  ELEMENT_DATA: InvestimentoAapm[] = []
  displayedColumns: string[] = ['data', 'investimento', 'valor'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);


  //----------Pagantes por semestre
  public semestreChartLabels: string[] = [ '1º Semestre', '2º Semestre', '3º Semestre', '4º Semestre' ];
  public semestreChartData: ChartData<'doughnut'> = {
    labels: this.semestreChartLabels,
    datasets: [
      { data: [ this.pagantesSemestre[0], this.pagantesSemestre[1], this.pagantesSemestre[2], this.pagantesSemestre[3] ] },
    ]
  };
  public semestreChartType: ChartType = 'doughnut';

  //-------------Total de pagantes
  public pagantesChartLabels: string[] = [ 'Não pagantes', 'Pagantes' ];
  public pagantesChartData: ChartData<'doughnut'> = {
    labels: this.pagantesChartLabels,
    datasets: [
      { data: [ this.totalAlunos - this.alunosPagantes, this.alunosPagantes ] },
    ]
  };
  public pagantesChartType: ChartType = 'doughnut';


  //-------------Total de pagantes por turma
  public pagantesTurmaChartLabels: string[] = [];
  public pagantesTurmaChartData: ChartData<'doughnut'> = {
    labels: this.pagantesTurmaChartLabels,
    datasets: [
      { data: [] },
    ]
  };
  public pagantesTurmaChartType: ChartType = 'doughnut';


  constructor(
    private service: AapmService,
    private toast: ToastrService,
    private alunoService: AlunoService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.findAll()
    this.findAllAlunosAtivosLazy()
    this.findAllInvestimentos()

  }

  findAll():void{
    this.service.findAll().subscribe(response=>{
      this.aapms = response
      this.applyDateFilter();
    },(ex)=>{
      this.toast.error(ex.error.error, 'Error')
    })
  }

  findAllAlunosAtivosLazy():void{
    this.alunoService.findAllByStatusLazy('ATIVO').subscribe(response=>{
      this.alunos = response
      this.totalAlunos = this.alunos.length
      this.pagantesChartData.datasets[0].data = [
        this.totalAlunos - this.alunosPagantes, this.alunosPagantes
      ]
      this.getPagantesPorTurma()
      this.chartUpdate()
    }, (ex)=>{
      this.toast.error(ex.error.error,'Error')
    })
  }

  findAllInvestimentos():void{
    this.service.investimentoFindAll().subscribe(response=>{
      this.ELEMENT_DATA = response
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.getTotalInvestido()
      this.getBalanco()
    },(ex) =>{
      this.toast.error(ex.error.error,'Error')
    })
  }

  getTotalArrecadado():void{
    this.totalArrecadado = 0
    this.aapmsFilter.forEach(aapm=>{
      this.totalArrecadado = this.totalArrecadado + aapm.valor
    })
    this.getBalanco()

  }

  getTotalInvestido():void{
    this.totalInvestido = 0
    this.dataSource.filteredData.forEach(element=>{
      this.totalInvestido = this.totalInvestido + element.valor
    })
    this.getBalanco()
  }

  getBalanco():void{
    this.balanco = this.totalArrecadado - this.totalInvestido
  }

  getPagamentos():void{
    this.pagamentos = this.aapmsFilter.length
  }

  getAlunosPagantes():void{
    let alunospagantes: string [] = []
    this.aapmsFilter.forEach((aapm)=>{
      if(!alunospagantes.includes(aapm.aluno)){
        alunospagantes.push(aapm.aluno)
      }
    })
    this.alunosPagantes = alunospagantes.length
  }

  getPagantesPorSemestre():void{
    this.pagantesSemestre = [0,0,0,0]
    this.aapmsFilter.forEach((aapm)=>{

      if(aapm.semestre === 'PRIMEIRO_SEMESTRE'){
        this.pagantesSemestre[0] = this.pagantesSemestre[0] + 1
      }else if(aapm.semestre === 'SEGUNDO_SEMESTRE'){
        this.pagantesSemestre[1] = this.pagantesSemestre[1] + 1
      }else if(aapm.semestre === 'TERCEIRO_SEMESTRE'){
        this.pagantesSemestre[2] = this.pagantesSemestre[2] + 1
      }else{
        this.pagantesSemestre[3] = this.pagantesSemestre[3] + 1
      }
    })


    this.semestreChartData.datasets[0].data = [
         this.pagantesSemestre[0], this.pagantesSemestre[1], this.pagantesSemestre[2], this.pagantesSemestre[3]
    ]

    this.chartUpdate()
  }

  getPagantesPorTurma():void{
    this.pagantesTurmaChartData.datasets[0].data = []
    let turmasKeys: string[] = []
    let turmasValues = {}
    let turmasPagantes: string [] = []
    this.aapmsFilter.forEach((aapm)=>{
      if(!turmasPagantes.includes(aapm.turma)){
        turmasPagantes.push(aapm.turma)
      }
      turmasKeys.push(aapm.turma)
    })

    turmasKeys.forEach(turma =>{
      (turmasValues[turma] = turmasValues[turma] + 1 || 1)
    })

    turmasPagantes.forEach(turma=>{
      if(!this.pagantesTurmaChartLabels.includes(turma)){
        this.pagantesTurmaChartLabels.push(turma)
      }

      this.pagantesTurmaChartData.datasets[0].data.push(turmasValues[turma])

    })

    this.chartUpdate()

  }

  applyDateFilter():void{
    this.totalInvestido = 0
    let startDate = new Date(this.startDate)
    startDate.setDate(startDate.getDate()+1)
    let endDate = new Date(this.endDate)
    endDate.setDate(endDate.getDate()+1)
    this.aapmsFilter = this.aapms.filter((aapm)=>{
    let dataPagamentoSplit = aapm.dataPagamento.split('-')
    let dataPagamento = new Date(parseInt(dataPagamentoSplit[0]),parseInt(dataPagamentoSplit[1]) - 1,parseInt(dataPagamentoSplit[2]))
    if(dataPagamento>= startDate && dataPagamento<= endDate){
      return true
    }else{
      return false

    }
    })
    let ELEMENT_DATA_FILTER =  this.ELEMENT_DATA.filter((element)=>{
    let dataSplit = element.data.split('-')
    let data = new Date(parseInt(dataSplit[0]),parseInt(dataSplit[1]) - 1,parseInt(dataSplit[2]))
    if(data>= startDate && data <= endDate){
      return true
    }else{
      return false
    }
    })
    this.dataSource = new MatTableDataSource(ELEMENT_DATA_FILTER)

    this.getTotalArrecadado();
    this.getTotalInvestido();
    this.getPagamentos();
    this.getPagantesPorSemestre();
    this.getPagantesPorTurma();
    this.getAlunosPagantes();
    this.getBalanco();
    this.chartsToCanvas();
  }

  // events
  public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
  }

  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
  }

  chartUpdate():void{
    this.charts.forEach((child) => {
      child.chart.update()
      this.chartsToCanvas();
  });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createInvestimentoDialog():void{
    let dialog = this.dialog.open(InvestimentoCreateComponent)
    dialog.afterClosed().subscribe(response=>{
        this.findAllInvestimentos()
    })
  }
  deleteInvestimentoDialog(id:number):void{
    let dialog = this.dialog.open(DialogComponent)
    dialog.afterClosed().subscribe(response=>{
      if(response == 'true'){
        this.deleteInvestimento(id)
      }
    })
  }

  deleteInvestimento(id:number):void{
    this.service.investimentoDelete(id).subscribe(response=>{
      this.toast.success('Investimento deletado com sucesso', 'Delete')
      this.findAllInvestimentos()
    },(ex)=>{
      this.toast.error(ex.error.error,'Error')
    })
  }

  updateInvestimentoDialog(id: number):void{
    let dialog = this.dialog.open(InvestimentoUpdateComponent, { data: [id]})
    dialog.afterClosed().subscribe(response=>{
      this.findAllInvestimentos()
    },(ex)=>{
      this.toast.error(ex.error.error,'Error')
    })
  }

  pagamentosToPdf():void{
    this.chartsToCanvas()
    if(this.aapmsFilter.length < 1){
      this.toast.error('Sem dados selecionados para geração de relatório!', 'Error')
    }
    let dialog = this.dialog.open(RelatorioPagamentosComponent, {data :[this.aapmsFilter, this.startDate, this.endDate]})
    dialog.afterClosed().subscribe(response=>{
      if(response){
        return
      }
    })
  }

  investimentosToPdf():void{
    this.chartsToCanvas()
    if(this.dataSource.filteredData.length < 1){
      this.toast.error('Sem dados selecionados para geração de relatório!', 'Error')
    }

    let dialog = this.dialog.open(RelatorioInvestimentosComponent, {data:[this.dataSource.filteredData,this.startDate, this.endDate, this.chartsUrl]})
    dialog.afterClosed().subscribe(response=>{
      if(response){
        return
      }
    })
  }

  chartsToCanvas():any{
    let charts = window.document.getElementById("toPdf");
    html2canvas(charts).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')
      this.chartsUrl = contentDataURL
      });

    }


}


