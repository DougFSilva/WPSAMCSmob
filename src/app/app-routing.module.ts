import { EvadidosComponent } from './components/aluno/evadidos/evadidos.component';
import { HomeComponent } from './components/home/home.component';
import { CursosComponent } from './components/curso/cursos/cursos.component';
import { FormandosComponent } from './components/aluno/formandos/formandos.component';
import { CursoDetalhesComponent } from './components/curso/curso-detalhes/curso-detalhes.component';
import { CursoUpdateComponent } from './components/curso/curso-update/curso-update.component';
import { TurmaCalendarioResolver } from './components/turma/turma-calendario/turma-calendario.resolvers';
import { CrachaComponent } from './components/aluno/cracha/cracha.component';
import { FuncionarioCreateComponent } from './components/funcionario/funcionario-create/funcionario-create.component';
import { FuncionarioDetalhesComponent } from './components/funcionario/funcionario-detalhes/funcionario-detalhes.component';
import { OperacaoComponent } from './components/operacao/operacao.component';
import { AlarmeComponent } from './components/alarme/alarme.component';
import { DashboardAapmComponent } from './components/aapm/dashboard-aapm/dashboard-aapm.component';
import { PhotoSaveFuncionarioComponent } from './components/funcionario/photo-save-funcionario/photo-save-funcionario.component';
import { FuncionarioUpdateComponent } from './components/funcionario/funcionario-update/funcionario-update.component';
import { FuncionariosComponent } from './components/funcionario/funcionarios/funcionarios.component';
import { AlunoImportComponent } from './components/aluno/aluno-import/aluno-import.component';
import { UsuarioUpdateComponent } from './components/usuario/usuario-update/usuario-update.component';
import { UsuarioCreateComponent } from './components/usuario/usuario-create/usuario-create.component';
import { UsuariosComponent } from './components/usuario/usuarios/usuarios.component';
import { RelatorioOcorrenciaComponent } from './components/aluno/relatorio-ocorrencia/relatorio-ocorrencia.component';
import { RelatorioPontoComponent } from './components/aluno/relatorio-ponto/relatorio-ponto.component';
import { AapmCreateComponent } from './components/aapm/aapm-create/aapm-create.component';
import { PhotoSaveComponent } from './components/aluno/photo-save/photo-save.component';
import { OcorrenciaUpdateComponent } from './components/aluno/ocorrencia-update/ocorrencia-update.component';
import { OcorrenciaCreateComponent } from './components/aluno/ocorrencia-create/ocorrencia-create.component';
import { AlunoDetalhesComponent } from './components/aluno/aluno-detalhes/aluno-detalhes.component';
import { TurmaCalendarioComponent } from './components/turma/turma-calendario/turma-calendario.component';
import { TurmaUpdateComponent } from './components/turma/turma-update/turma-update.component';
import { TurmaCreateComponent } from './components/turma/turma-create/turma-create.component';
import { AlunoTurmaComponent } from './components/aluno/aluno-turma/aluno-turma.component';
import { TurmaDetalhesComponent } from './components/turma/turma-detalhes/turma-detalhes.component';
import { CursoCreateComponent } from './components/curso/curso-create/curso-create.component';
import { AlunoUpdateComponent } from './components/aluno/aluno-update/aluno-update.component';
import { AlunoCreateComponent } from "./components/aluno/aluno-create/aluno-create.component";
import { AlunosComponent } from "./components/aluno/alunos/alunos.component";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./components/login/login.component";
import { NavComponent } from "./components/nav/nav.component";
import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TurmasComponent } from "./components/turma/turmas/turmas.component";
import { AapmUpdateComponent } from './components/aapm/aapm-update/aapm-update.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "",
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [

      {
        path: "home",
        component: HomeComponent,
      },

      {
        path: "alarmes",
        component: AlarmeComponent,
      },
      {
        path: "turmas",
        component: TurmasComponent,
      },
      {
        path: "turma/:id",
        component: TurmaDetalhesComponent,
      },
      {
        path: "turma/:id/calendario",
        component: TurmaCalendarioComponent, resolve:{
          aulas: TurmaCalendarioResolver
        }
      },
      {
        path: "cursos",
        component: CursosComponent,
      },
      {
        path: "curso/create",
        component: CursoCreateComponent,
      },
      {
        path: "curso/:id/update",
        component: CursoUpdateComponent,
      },
      {
        path: "curso/:id",
        component: CursoDetalhesComponent,
      },
      {
        path: "curso/:id/turma/create",
        component: TurmaCreateComponent,
      },
      {
        path: "turma/:id/update",
        component: TurmaUpdateComponent,
      },
      {
        path: "turma/:idTurma/alunos",
        component: AlunoTurmaComponent,
      },
      {
        path: "aluno/:id/update",
        component: AlunoUpdateComponent,
      },
      {
        path: "alunos",
        component: AlunosComponent,
      },
      {
        path: "aluno/create",
        component: AlunoCreateComponent,
      },
      {
        path: "aluno/:id/foto",
        component: PhotoSaveComponent,
      },
      {
        path: "aluno/:id/cracha",
        component: CrachaComponent,
      },
      {
        path: "aluno/:id",
        component: AlunoDetalhesComponent,
      },
      {
        path: "aluno/:id/ocorrencia/create",
        component: OcorrenciaCreateComponent
      },

      {
        path: "ocorrencia/:id/update",
        component: OcorrenciaUpdateComponent
      },

      {
        path: "aluno/relatorio/ponto",
        component: RelatorioPontoComponent
      },

      {
        path: "aluno/relatorio/ocorrencia",
        component: RelatorioOcorrenciaComponent
      },

      {
        path: "alunos/import",
        component: AlunoImportComponent
      },

      {
        path: "aapm",
        component: DashboardAapmComponent,
      },
      {
        path: "aapm/aluno/:id",
        component: AapmCreateComponent,
      },
      {
        path: "aapm/:id/update",
        component: AapmUpdateComponent,
      },

      {
        path: "formandos",
        component: FormandosComponent,
      },

      {
        path: "funcionarios",
        component: FuncionariosComponent,
      },

      {
        path: "funcionario/create",
        component: FuncionarioCreateComponent,
      },

      {
        path: "funcionario/:id/update",
        component: FuncionarioUpdateComponent,
      },

      {
        path: "funcionario/:id",
        component: FuncionarioDetalhesComponent,
      },

      {
        path: "funcionario/:id/foto",
        component: PhotoSaveFuncionarioComponent,
      },

      {
        path: "evadidos",
        component: EvadidosComponent,
      },

      {
        path: "operacao",
        component: OperacaoComponent,
      },

      {
        path: "usuarios",
        component: UsuariosComponent,
      },
      {
        path: "usuario/create",
        component: UsuarioCreateComponent,
      },
      {
        path: "usuario/:id/update",
        component: UsuarioUpdateComponent,
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
