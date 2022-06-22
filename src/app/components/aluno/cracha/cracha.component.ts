import { FormControl, Validators } from "@angular/forms";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import jsPDF from "jspdf";
import { Aluno } from "src/app/models/Aluno";

@Component({
  selector: "app-cracha",
  templateUrl: "./cracha.component.html",
  styleUrls: ["./cracha.component.css"],
})
export class CrachaComponent implements OnInit {
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

  nomeCurso: string;
  nome: string;
  sobreNome: string;
  validade: string;

  inputValidade: FormControl = new FormControl(null, Validators.minLength(10));

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.aluno = this.data[0];
    let nome = this.aluno.nome.split(" ");
    this.nome = nome[0];
    let sobreNome = nome.slice(1, nome.length);
    this.sobreNome = sobreNome.join(" ");
    console.log(this.sobreNome);
    this.rgTransform(this.aluno.rg);
    this.cursoTransform(this.aluno.curso);
  }

  rgTransform(rg: string): void {
    if (rg.length > 7) {
      rg.replace(/./g, "");
      rg.replace(/-/g, "");
      let rg1: string = rg.slice(0, 2);
      let rg2: string = rg.slice(2, 5);
      let rg3: string = rg.slice(5, 8);
      let rg4: string = rg.slice(8, 11);
      this.aluno.rg = `${rg1}.${rg2}.${rg3}-${rg4}`;
      return;
    }
  }

  cursoTransform(curso: string): void {
    if (curso) {
      this.aluno.curso = curso.slice(0, 31);
    }
  }

  validaCampos(): boolean {
    return this.inputValidade.valid;
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
