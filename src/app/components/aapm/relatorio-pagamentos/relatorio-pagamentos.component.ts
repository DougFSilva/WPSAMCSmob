import { Aapm } from "src/app/models/Aapm";
import { Component, Inject, OnInit } from "@angular/core";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-relatorio-pagamentos",
  templateUrl: "./relatorio-pagamentos.component.html",
  styleUrls: ["./relatorio-pagamentos.component.css"],
})
export class RelatorioPagamentosComponent implements OnInit {
  totalPagamentos: number = 0;
  aapms: Aapm[] = [];
  startDate: Date;
  endDate: Date;
  chartsUrl: any;
  table: Object[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.aapms = this.data[0];
    this.startDate = this.data[1];
    this.endDate = this.data[2];
    this.data[0].forEach((element) => {
      this.table.push({
        data: element.dataPagamento,
        aluno: element.aluno,
        curso: element.curso,
        semestre: element.semestre,
        recibo: element.recibo,
        valor: element.valor,
      });
    });
    console.log(this.aapms);
    console.log("-----------------------");
    console.log(this.table);
    this.getTotalPagamentos();
  }

  getTotalPagamentos(): void {
    this.totalPagamentos = 0;
    this.aapms.forEach((element) => {
      this.totalPagamentos = this.totalPagamentos + element.valor;
    });
  }

  async toPDF() {
    let pdf = new jsPDF("p", "mm", "a4");
    let pages = Math.ceil(this.table.length / 12);
    let partOfTableStart = 0;
    let partOdTableEnd = 12;
    pdf.setFontSize(12);
    let formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    pdf.text(
      `Total de pagamentos: ${formatter.format(this.totalPagamentos)}`,
      120,
      51
    );
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
      partOfTableStart = partOfTableStart + 12;
      partOdTableEnd = partOdTableEnd + 12;
    }

    this.addPdfFooter(pdf);
    let totalPages = pdf.getNumberOfPages();
    pdf.deletePage(totalPages);
    pdf.save(
      `${new Date().toLocaleDateString(
        "pt-BR"
      )}_Relatório de apagamentos da Aapm`
    );
  }

  addPdfHeader(pdf: jsPDF) {
    pdf.setTextColor("black");
    pdf.setFontSize(9);
    pdf.text(`Escola SENAI "Antônio Ermírio de Moraes"`, 75, 5);
    pdf.setFontSize(20);
    pdf.setFont("calibri", "bold");
    pdf.text("RELATÓRIO DE PAGAMENTOS DA AAPM", 30, 15);
    pdf.rect(10, 20, 190, 25);
    pdf.setFillColor(235, 235, 235);
    pdf.rect(10, 20, 190, 6, "FD");
    pdf.setTextColor("black");
    pdf.setFontSize(12);
    pdf.text("Dados do relatório", 13, 24);
    pdf.text("Dados filtrados entre as datas: ", 13, 30);
    pdf.text("Data inicial:", 13, 36);
    pdf.text("Data final:", 13, 42);
    pdf.setFont("calibri", "normal");
    let startDate = new Date(this.startDate);
    startDate.setDate(startDate.getDate() + 1);
    let startDateString = startDate.toLocaleDateString("pt-BR");
    let endDate = new Date(this.endDate);
    endDate.setDate(endDate.getDate() + 1);
    let endDateString = endDate.toLocaleDateString("pt-BR");
    this.startDate != null ? pdf.text(startDateString, 36, 36.2) : null;
    this.endDate != null ? pdf.text(endDateString, 33, 42.2) : null;
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
      "           Assinatura                                           Assinatura                                        Assinatura",
      20,
      286
    );
  }
  addPdfContentCharts(pdf: jsPDF) {
    pdf.addImage(this.chartsUrl, "png", 10, 50, 190, 200);
  }

  addPdfContentAutoTable(pdf: jsPDF, table: any[]) {
    let tableBody = [];
    let formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    table.forEach((element) => {
      let tableRow = [
        element.data,
        element.aluno,
        element.curso,
        element.semestre,
        element.recibo,
        formatter.format(element.valor),
      ];
      tableBody.push(tableRow);
    });
    autoTable(pdf, {
      theme: "striped",
      margin: {
        horizontal: 10,
      },
      startY: 55,
      head: [["Data", "Aluno", "Curso", "Semestre", "Recibo", "Valor"]],
      body: tableBody,
      columnStyles: {
        0: {
          cellWidth: 25,
        },
        1: {
          cellWidth: 50,
        },
        2: {
          cellWidth: 40,
        },
        3: {
          cellWidth: 25,
        },
        4: {
          cellWidth: 25,
        },
        5: {
          cellWidth: 25,
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
