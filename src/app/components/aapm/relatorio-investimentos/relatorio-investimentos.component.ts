import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { InvestimentoAapm } from "src/app/models/InvestimentoAapm";

@Component({
  selector: "app-relatorio-investimentos",
  templateUrl: "./relatorio-investimentos.component.html",
  styleUrls: ["./relatorio-investimentos.component.css"],
})
export class RelatorioInvestimentosComponent implements OnInit {
  totalInvestimentos: number = 0;
  investimentos: InvestimentoAapm[] = [];
  startDate: string;
  endDate: string;
  chartsUrl: any;
  table: Object[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.investimentos = this.data[0];
    this.startDate = this.data[1];
    this.endDate = this.data[2];
    this.chartsUrl = this.data[3];
    this.data[0].forEach((element) => {
      this.table.push({
        data: element.data,
        investimento: element.investimento,
        valor: element.valor,
      });
    });
    this.getTotalInvestimentos();
  }

  getTotalInvestimentos(): void {
    this.totalInvestimentos = 0;
    this.investimentos.forEach((element) => {
      this.totalInvestimentos = this.totalInvestimentos + element.valor;
    });
  }

  async toPDF() {
    let pdf = new jsPDF("p", "mm", "a4");
    let pages = Math.ceil(this.table.length / 28);
    let partOfTableStart = 0;
    let partOdTableEnd = 28;
    pdf.setFontSize(12);
    let formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    pdf.text(
      `Total de investimentos: ${formatter.format(this.totalInvestimentos)}`,
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
      partOfTableStart = partOfTableStart + 28;
      partOdTableEnd = partOdTableEnd + 28;
    }

    this.addPdfFooter(pdf);
    let totalPages = pdf.getNumberOfPages();
    pdf.deletePage(totalPages);
    pdf.save(
      `${new Date().toLocaleDateString(
        "pt-BR"
      )}_Relatório de investimentos da Aapm`
    );
  }

  addPdfHeader(pdf: jsPDF) {
    pdf.setTextColor("black");
    pdf.setFontSize(9);
    pdf.text(`Escola SENAI "Antônio Ermírio de Moraes"`, 75, 5);
    pdf.setFontSize(20);
    pdf.setFont("calibri", "bold");
    pdf.text("RELATÓRIO DE INVESTIMENTOS DA AAPM", 28, 15);
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
        element.investimento,
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
      head: [["Data", "Investimento", "Valor"]],
      body: tableBody,
      columnStyles: {
        0: {
          cellWidth: 30,
        },
        1: {
          cellWidth: 130,
        },
        2: {
          cellWidth: 30,
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
