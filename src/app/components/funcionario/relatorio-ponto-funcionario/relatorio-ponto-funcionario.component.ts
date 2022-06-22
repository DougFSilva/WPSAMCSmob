import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Funcionario } from "src/app/models/Funcionario";
import { PontoFuncionario } from "src/app/models/PontoFuncionario";

@Component({
  selector: "app-relatorio-ponto-funcionario",
  templateUrl: "./relatorio-ponto-funcionario.component.html",
  styleUrls: ["./relatorio-ponto-funcionario.component.css"],
})
export class RelatorioPontoFuncionarioComponent implements OnInit {
  @ViewChild("content", { static: false }) el: ElementRef;
  @ViewChild("footer", { static: false }) footer: ElementRef;

  pontoFuncionario: PontoFuncionario[] = [];
  funcionario: Funcionario = {
    id: null,
    matricula: null,
    nome: "",
    sexo: "",
    idade: "",
    cidade: "",
    rg: "",
    dataNascimento: "",
    email: "",
    telefone: "",
    entradaSaida: "",
    empresa: "",
    tag: null,
    foto: "any",
  };
  table: Object[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.pontoFuncionario = this.data[0];
    this.funcionario = this.data[1];
    this.data[0].forEach((element) => {
      this.table.push({
        data: element.data,
        horario: element.horario,
        acao: element.acao,
      });
    });
  }

  async toPDF() {
    let pdf = new jsPDF("p", "mm", "a4");
    let pages = Math.ceil(this.table.length / 24);
    let partOfTableStart = 0;
    let partOdTableEnd = 24;
    for (let i = 0; i < pages; i++) {
      pdf.addPage();
      pdf.setPage(i + 1);
      this.addPdfHeader(pdf);
      pdf.text(`página: ${i + 1}/${pages}`, 180, 5);
      pdf.setFontSize(9);
      pdf.text(
        `Data de impressão: ${new Date().toLocaleDateString("pt-br")}`,
        165,
        292
      );
      let partOfTable = this.table.slice(partOfTableStart, partOdTableEnd);
      this.addPdfContentAutoTable(pdf, partOfTable);
      partOfTableStart = partOfTableStart + 24;
      partOdTableEnd = partOdTableEnd + 24;
    }

    this.addPdfFooter(pdf);
    let totalPages = pdf.getNumberOfPages();
    pdf.deletePage(totalPages);
    pdf.save(`Ponto_${this.funcionario.nome}`);
  }

  addPdfHeader(pdf: jsPDF) {
    pdf.setTextColor("black");
    pdf.setFontSize(9);
    pdf.text(`Escola SENAI "Antônio Ermírio de Moraes"`, 75, 5);
    pdf.setFontSize(20);
    pdf.setFont("calibri", "bold");
    pdf.text("RELATÓRIO DE PONTO", 63, 15);
    pdf.rect(10, 20, 190, 30);
    pdf.setFillColor(235, 235, 235);
    pdf.rect(10, 20, 190, 6, "FD");
    pdf.setTextColor("black");
    pdf.setFontSize(12);
    pdf.text("Dados do funcionário", 13, 24);
    pdf.text("Nome:", 13, 30);
    pdf.text("Idade:", 177, 30);
    pdf.text("Data de nasc:", 13, 36);
    pdf.text("Telefone:", 90, 36);
    pdf.text("Rg:", 145, 36);
    pdf.text("Cidade:", 13, 42);
    pdf.text("Matrícula:", 90, 42);
    pdf.text("Email:", 13, 48);
    pdf.text("Empresa:", 105, 48);
    pdf.setFont("calibri", "normal");
    this.funcionario.nome != null
      ? pdf.text(this.funcionario.nome, 26, 30.2)
      : null;
    this.funcionario.idade != null
      ? pdf.text(this.funcionario.idade.toString(), 190, 30.2)
      : null;
    this.funcionario.dataNascimento != null
      ? pdf.text(
          new Date(
            this.funcionario.dataNascimento.toString()
          ).toLocaleDateString("pt-br"),
          39,
          36.2
        )
      : false;
    this.funcionario.telefone != null
      ? pdf.text(this.funcionario.telefone, 108, 36.2)
      : null;
    this.funcionario.rg != null
      ? pdf.text(this.funcionario.rg, 153, 36.2)
      : null;
    this.funcionario.cidade != null
      ? pdf.text(this.funcionario.cidade, 28, 42.2)
      : false;
    this.funcionario.matricula != null
      ? pdf.text(this.funcionario.matricula.toString(), 110, 42.2)
      : null;
    this.funcionario.email != null
      ? pdf.text(this.funcionario.email, 26, 48.2)
      : null;
    this.funcionario.empresa != null
      ? pdf.text(this.funcionario.empresa, 124, 48.2)
      : false;
  }

  addPdfFooter(pdf: jsPDF) {
    pdf.setFont("calibri", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "(Local e data)____________________ , _____ de _________________ de ________",
      30,
      260
    );
    pdf.text(
      "________________________           ________________________           ",
      16,
      280
    );
    pdf.text(
      " Responsável do SENAI                                 Funcionário",
      20,
      286
    );
  }

  addPdfContentAutoTable(pdf: jsPDF, table: any[]) {
    let tableBody = [];
    table.forEach((element) => {
      let tableRow = [element.data, element.horario, element.acao];
      tableBody.push(tableRow);
    });
    autoTable(pdf, {
      theme: "striped",
      margin: {
        horizontal: 45,
      },
      startY: 60,
      head: [["Data", "Horário", "Ação"]],
      body: tableBody,
      columnStyles: {
        0: {
          cellWidth: 40,
        },
        1: {
          cellWidth: 40,
        },
        2: {
          cellWidth: 40,
        },
      },
      headStyles: {
        halign: "center",
        fontStyle: "bold",
        fillColor: "rgb(200,200,200)",
      },
      bodyStyles: {
        halign: "center",
      },
    });
  }
}
