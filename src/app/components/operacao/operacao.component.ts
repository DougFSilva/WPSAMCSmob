import { Router } from "@angular/router";
import { AlunoService } from "src/app/services/aluno.service";
import { DialogComponent } from "./../dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { SolicitacaoService } from "./../../services/solicitacao.service";
import { Solicitacao } from "./../../models/Solicitacao";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Aluno } from "src/app/models/Aluno";

@Component({
  selector: "app-operacao",
  templateUrl: "./operacao.component.html",
  styleUrls: ["./operacao.component.css"],
})
export class OperacaoComponent implements OnInit {
  ELEMENT_DATA: Solicitacao[] = [];
  displayedColumns: string[] = [
    "dataSolicitacao",
    "dataConclusao",
    "turma",
    "aluno",
    "descricao",
    "status",
    "acao",
  ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  alunos: Aluno[] = [];

  constructor(
    private service: SolicitacaoService,
    private alunoService: AlunoService,
    private toast: ToastrService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.service.findAll().subscribe(
      (response) => {
        let sort: Solicitacao[] = [];
        response.forEach((element) => {
          if (element.status == false) {
            sort.push(element);
          }
        });
        response.forEach((element) => {
          if (element.status == true) {
            sort.push(element);
          }
        });
        this.ELEMENT_DATA = sort;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  bloqueioInternetGeralDialog() {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.bloqueioInternetGeral();
      }
      return;
    });
  }
  bloqueioInternetGeral() {
    this.alunoService.findAllByStatus("ATIVO").subscribe(
      (response) => {
        this.alunos = response;
        this.alunos.forEach((aluno) => {
          this.alunoService.updateInternetLiberada(aluno.id, false).subscribe(
            (response) => {
              console.log(response);
            },
            (ex) => {
              this.toast.error(ex.error.error, "Error");
            }
          );
        });
        this.toast.success(`Alunos editados com sucesso!`, "Update");
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  updateStatusSolicitacaoDialog(id: number, status: boolean) {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.updateStatusSolicitacao(id, status);
      }
      return;
    });
  }

  updateStatusSolicitacao(id: number, status: boolean) {
    this.service.updateStatus(id, status).subscribe(
      (response) => {
        this.toast.success("Solicitação fechada com sucesso!", "Update");
        this.findAll();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  deleteByIdDialog(id: number) {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.deleteById(id);
      }
      return;
    });
  }

  deleteById(id: number) {
    this.service.deleteById(id).subscribe(
      (response) => {
        this.toast.success("Solicitação deletada com sucesso!", "Delete");
        this.findAll();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  deleteAllDialog(): void {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.deleteAll();
      }
      return;
    });
  }

  deleteAll(): void {
    this.service.deleteAll().subscribe(
      (response) => {
        this.toast.success("Solicitações deletadas com sucesso!", "Delete");
        this.findAll();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  findAlunoById(id: number): void {
    this.router.navigate([`/aluno/${id}`]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
