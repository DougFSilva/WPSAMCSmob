import { DialogComponent } from "./../../dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AlunoService } from "src/app/services/aluno.service";
import { Component, OnInit } from "@angular/core";

import * as XLSX from "xlsx";
import { Aluno } from "src/app/models/Aluno";
import { MatTableDataSource } from "@angular/material/table";
import { Location } from "@angular/common";

@Component({
  selector: "app-aluno-import",
  templateUrl: "./aluno-import.component.html",
  styleUrls: ["./aluno-import.component.css"],
})
export class AlunoImportComponent implements OnInit {
  ELEMENT_DATA: Aluno[] = [];
  displayedColumns: string[] = [
    "nome",
    "rg",
    "cidade",
    "dataNascimento",
    "email",
    "telefone",
    "turma",
    "numeroTurma",
    "matricula",
    "dataMatricula",
    "empresa",
  ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  totalAlunos: number = 0;
  constructor(
    private service: AlunoService,
    private toast: ToastrService,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: "binary" });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.ELEMENT_DATA = jsonData.Planilha1;

      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.totalAlunos = this.dataSource.data.length;
    };
    reader.readAsBinaryString(file);
  }

  createAllDialog(): void {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.createAll();
      } else {
        return;
      }
    });
  }
  createAll() {
    this.dataSource.filteredData.forEach((element) => {
      element.rg = element.rg.replace(/\.|\-/g, "");
      let dataNascimento = element.dataNascimento.split("/");
      element.dataNascimento = `${dataNascimento[2]}-${dataNascimento[1]}-${dataNascimento[0]}`;
      let dataMatricula = element.dataMatricula.split("/");
      element.dataMatricula = `${dataMatricula[2]}-${dataMatricula[1]}-${dataMatricula[0]}`;
    });
    this.service.createAll(this.dataSource.filteredData).subscribe(
      (response) => {
        this.toast.success(
          `${response.length} alunos importados com sucesso!`,
          "Create"
        );
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.totalAlunos = this.dataSource.filteredData.length;
  }
}
