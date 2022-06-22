import { Ocorrencia } from "src/app/models/Ocorrencia";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Aluno } from "src/app/models/Aluno";

@Component({
  selector: "app-relatorio-ocorrencia",
  templateUrl: "./relatorio-ocorrencia.component.html",
  styleUrls: ["./relatorio-ocorrencia.component.css"],
})
export class RelatorioOcorrenciaComponent implements OnInit {
  aluno: Aluno = {
    id: "",
    matricula: null,
    dataMatricula: "",
    dataCriacao: new Date(),
    turma: "",
    numeroTurma: null,
    curso: "",
    nome: "",
    sexo: "",
    idade: "",
    cidade: "",
    rg: "",
    dataNascimento: "",
    email: "",
    telefone: "",
    termoInternet: false,
    internetLiberada: false,
    desbloqueioTemporario: false,
    entradaSaida: "",
    status: "",
    empresa: "",
    tag: null,
    foto: "any",
  };
  ocorrencia: Ocorrencia[] = [];
  table: Object[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.ocorrencia = this.data[0];
    this.aluno = this.data[1];
    this.data[0].forEach((element) => {
      this.table.push({
        data: element.data,
        tipo: element.tipo,
        registrador: element.registrador,
        descricao: element.descricao,
      });
    });
  }

  async toPDF() {
    let pdf = new jsPDF("p", "mm", "a4");
    let pages = Math.ceil(this.table.length / 13);
    let partOfTableStart = 0;
    let partOfTableEnd = 13;
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
      let partOfTable = this.table.slice(partOfTableStart, partOfTableEnd);
      this.addPdfContentAutoTable(pdf, partOfTable);
      partOfTableStart = partOfTableStart + 13;
      partOfTableEnd = partOfTableEnd + 13;
    }

    this.addPdfFooter(pdf);
    let totalPages = pdf.getNumberOfPages();
    pdf.deletePage(totalPages);
    pdf.save(`Ocorrencias_${this.aluno.nome}`);
  }

  addPdfHeader(pdf: jsPDF) {
    pdf.setTextColor("black");
    pdf.setFontSize(9);
    pdf.text(`Escola SENAI "Antônio Ermírio de Moraes"`, 75, 5);
    pdf.setFontSize(20);
    pdf.setFont("calibri", "bold");
    pdf.text("RELATÓRIO DE OCORRÊNCIAS", 52, 15);
    pdf.rect(10, 20, 190, 30);
    pdf.setFillColor(235, 235, 235);
    pdf.rect(10, 20, 190, 6, "FD");
    pdf.setTextColor("black");
    pdf.setFontSize(12);
    pdf.text("Dados do aluno", 13, 24);
    pdf.text("Nome:", 13, 30);
    pdf.text("Turma:", 135, 30);
    pdf.text("Idade:", 177, 30);
    pdf.text("Data de nasc:", 13, 36);
    pdf.text("Telefone:", 90, 36);
    pdf.text("Rg:", 145, 36);
    pdf.text("Cidade:", 13, 42);
    pdf.text("Matrícula:", 90, 42);
    pdf.text("Data de matr:", 145, 42);
    pdf.text("Email:", 13, 48);
    pdf.text("Empresa:", 105, 48);
    pdf.setFont("calibri", "normal");
    this.aluno.nome != null ? pdf.text(this.aluno.nome, 26, 30.2) : null;
    this.aluno.turma != null ? pdf.text(this.aluno.turma, 150, 30.2) : null;
    this.aluno.idade != null
      ? pdf.text(this.aluno.idade.toString(), 190, 30.2)
      : null;
    this.aluno.dataNascimento != null
      ? pdf.text(
          new Date(this.aluno.dataNascimento.toString()).toLocaleDateString(
            "pt-br"
          ),
          39,
          36.2
        )
      : false;
    this.aluno.telefone != null
      ? pdf.text(this.aluno.telefone, 108, 36.2)
      : null;
    this.aluno.rg != null ? pdf.text(this.aluno.rg, 153, 36.2) : null;
    this.aluno.cidade != null ? pdf.text(this.aluno.cidade, 28, 42.2) : false;
    this.aluno.matricula != null
      ? pdf.text(this.aluno.matricula.toString(), 110, 42.2)
      : null;
    this.aluno.dataMatricula != null
      ? pdf.text(
          new Date(this.aluno.dataMatricula.toString()).toLocaleDateString(
            "pt-br"
          ),
          171,
          42.2
        )
      : null;
    this.aluno.email != null ? pdf.text(this.aluno.email, 26, 48.2) : null;
    this.aluno.empresa != null
      ? pdf.text(this.aluno.empresa, 124, 48.2)
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
      "________________________           ________________________           ________________________",
      16,
      280
    );
    pdf.text(
      " Responsável do SENAI                                   Aluno                                   Responsável pelo aluno",
      20,
      286
    );
  }

  addPdfContentAutoTable(pdf: jsPDF, table: any[]) {
    let tableBody = [];
    table.forEach((element) => {
      let tableRow = [
        element.data,
        element.tipo,
        element.registrador,
        element.descricao,
      ];
      tableBody.push(tableRow);
    });
    autoTable(pdf, {
      theme: "striped",
      margin: {
        horizontal: 10,
      },
      startY: 60,
      head: [["Data", "Tipo", "Registrador por", "Descrição"]],
      body: tableBody,
      columnStyles: {
        0: {
          cellWidth: 30,
        },
        1: {
          cellWidth: 30,
        },
        2: {
          cellWidth: 45,
        },
        3: {
          cellWidth: 80,
        },
      },
      headStyles: {
        halign: "center",
        fontStyle: "bold",
        fillColor: "rgb(200,200,200)",
      },
      bodyStyles: {
        halign: "center",
        valign: "middle",
      },
    });
  }
}
