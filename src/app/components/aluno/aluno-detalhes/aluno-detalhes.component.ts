import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Aluno } from 'src/app/models/Aluno';
import { Turma } from 'src/app/models/Turma';
import { Curso } from 'src/app/models/Curso';
import { Ocorrencia } from 'src/app/models/Ocorrencia';
import { PontoAluno } from 'src/app/models/PontoAluno';
import { SolicitacaoFORM } from 'src/app/models/SolicitacaoFORM';
import { SolicitacaoService } from 'src/app/services/solicitacao.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlunoService } from 'src/app/services/aluno.service';
import { CursoService } from 'src/app/services/curso.service';

export class PontoAlunoTable {
  data: string;
  horario: string;
  acao: string;

  constructor(pontoAluno: PontoAluno) {
    let timestampSplit = pontoAluno.timestamp.split(' ');
    this.data = timestampSplit[0];
    this.horario = timestampSplit[1];
    this.acao = pontoAluno.entradaSaida;
  }
}

@Component({
  selector: 'app-aluno-detalhes',
  templateUrl: './aluno-detalhes.component.html',
  styleUrls: ['./aluno-detalhes.component.css'],
})
export class AlunoDetalhesComponent implements OnInit {
  perfilUsuario: string;
  idAluno: number;
  aluno: Aluno = {
    id: '',
    matricula: null,
    dataMatricula: '',
    dataCriacao: new Date(),
    turma: '',
    numeroTurma: null,
    curso: '',
    nome: '',
    sexo: '',
    idade: '',
    cidade: '',
    rg: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    termoInternet: false,
    internetLiberada: false,
    desbloqueioTemporario: false,
    entradaSaida: '',
    status: '',
    empresa: '',
    tag: null,
    foto: 'any',
  };

  turma: Turma = {
    id: '',
    codigo: '',
    curso: '',
    entrada: '',
    saida: '',
    almocoEntrada: '',
    almocoSaida: '',
    toleranciaEntrada: null,
    toleranciaSaida: null,
    periodo: '',
    aulas: [],
    imagem: '',
  };

  curso: Curso = {
    id: '',
    modalidade: '',
    areaTecnologica: '',
    turma: [],
    imagem: '',
  };

  solicitacaoFORM: SolicitacaoFORM = {
    descricao: '',
    status: false,
  };

  bloqOcorrencia: number;

  ELEMENT_DATA_ocorrencia: Ocorrencia[] = [];
  ELEMENT_DATA_ponto: PontoAlunoTable[] = [];

  displayedColumns: string[] = [
    'data',
    'tipo',
    'registrado_por',
    'descrição',
    'bloqueio',
    'acao',
  ];

  displayedColumnsPonto: string[] = ['data', 'horario', 'acao'];

  displayedColumnsAapm: string[] = [
    'data',
    'semestre',
    'recibo',
    'valor',
    'acao',
  ];

  dataSourceOcorrencia = new MatTableDataSource<Ocorrencia>(
    this.ELEMENT_DATA_ocorrencia
  );
  dataSourcePonto = new MatTableDataSource<PontoAlunoTable>(
    this.ELEMENT_DATA_ponto
  );

  constructor(
    private cursoService: CursoService,
    private service: AlunoService,
    private solicitacaoService: SolicitacaoService,
    private toast: ToastrService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.perfilUsuario = this.usuarioService.getPerfilUsuario();
    this.ELEMENT_DATA_ocorrencia = this.route.snapshot.data['ocorrencia'];
    this.idAluno = parseInt(this.route.snapshot.paramMap.get('id'));
    this.findById();
  }

  findById(): void {
    this.service.findById(this.idAluno).subscribe(
      (response) => {
        this.aluno = response;
        this.aluno.idade = this.getIdade(this.aluno.dataNascimento);
      },
      (ex) => {
        this.toast.error(ex.error.error, 'Error');
      }
    );
  }

  deleteByIdDialog() {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == 'true') {
        this.deleteById();
      }
      return;
    });
  }

  solicitarCrachaDialog() {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == 'true') {
        this.solicitarCracha();
      }
      return;
    });
  }

  solicitarCracha() {
    this.solicitacaoFORM.descricao = 'Impressão de crachá';
    this.solicitacaoFORM.status = false;
    this.solicitacaoService
      .create(this.solicitacaoFORM, this.aluno.id)
      .subscribe(
        () => {
          this.toast.success('Solicitação enviada com sucesso!', 'Create');
        },
        (ex) => {
          this.toast.error(ex.error.error, 'Error');
        }
      );
  }

  deleteById(): void {
    this.service.deleteById(this.aluno.id).subscribe(
      () => {
        this.toast.success('Aluno deletado com sucesso!', 'Delete');
        this.location.back();
      },
      (ex) => {
        this.toast.error(ex.error.error, 'Error');
      }
    );
  }

  updateStatusByIdDialog(status: string) {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == 'true') {
        this.updateStatusById(status);
      }
      return;
    });
  }

  updateStatusById(status: string) {
    this.aluno.status = status;
    this.findCursoByTurmaCodigo();
    this.service.updateStatus(this.aluno.id, status).subscribe(
      () => {
        this.toast.success('Status alterado com sucesso!', 'Update');
        this.location.back();
      },
      (ex) => {
        this.toast.error(ex.error.error, 'Error');
      }
    );
  }

  findCursoByTurmaCodigo(): void {
    this.cursoService
      .findByTurmaCodigo(this.aluno.turma)
      .subscribe((response) => {
        this.curso = response;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceOcorrencia.filter = filterValue.trim().toLowerCase();
  }

  getIdade(birthdate: string): string {
    let birthdateSplit = birthdate.split('-');
    const today = new Date().toLocaleDateString('en-CA').split('-');
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
