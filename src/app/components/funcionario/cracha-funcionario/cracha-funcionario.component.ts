import { Funcionario } from "src/app/models/Funcionario";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import jsPDF from "jspdf";

@Component({
  selector: "app-cracha-funcionario",
  templateUrl: "./cracha-funcionario.component.html",
  styleUrls: ["./cracha-funcionario.component.css"],
})
export class CrachaFuncionarioComponent implements OnInit {
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

  nomeCurso: string;
  nome: string;
  sobreNome: string;
  validade: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.funcionario = this.data[0];
    let nome = this.funcionario.nome.split(" ");
    this.nome = nome[0];
    let sobreNome = nome.slice(1, nome.length);
    this.sobreNome = sobreNome.join(" ");
    console.log(this.sobreNome);
    this.rgTransform(this.funcionario.rg);
  }

  rgTransform(rg: string): void {
    if (rg.length > 7) {
      rg.replace(/./g, "");
      rg.replace(/-/g, "");
      let rg1: string = rg.slice(0, 2);
      let rg2: string = rg.slice(2, 5);
      let rg3: string = rg.slice(5, 8);
      let rg4: string = rg.slice(8, 11);
      this.funcionario.rg = `${rg1}.${rg2}.${rg3}-${rg4}`;
      return;
    }
  }

  getValidade(dataMatricula: string): void {
    if (dataMatricula) {
      let date = new Date(dataMatricula);
      this.validade = date
        .setFullYear(date.getFullYear() + 2)
        .toLocaleString("pt-BR");
    }
  }

  toPDF() {
    let pdf = new jsPDF({
      orientation: "p",
      unit: "px",
      format: [220, 360],
    });
    let html = window.document.getElementById("card");

    pdf.html(html, {
      callback: function (doc) {
        doc.deletePage(2);
        doc.output("dataurlnewwindow");
      },
    });
  }
}
