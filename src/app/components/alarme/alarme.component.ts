import { Router } from "@angular/router";
import { DialogComponent } from "./../dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AlarmeService } from "./../../services/alarme.service";
import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Alarm } from "src/app/models/Alarm";

@Component({
  selector: "app-alarme",
  templateUrl: "./alarme.component.html",
  styleUrls: ["./alarme.component.css"],
})
export class AlarmeComponent implements OnInit {
  ELEMENT_DATA: Alarm[] = [];
  displayedColumns: string[] = [
    "data",
    "turma",
    "nome",
    "descricao",
    "status",
    "acao",
  ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  constructor(
    private service: AlarmeService,
    private toast: ToastrService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.service.findAll().subscribe(
      (response) => {
        let sort: Alarm[] = [];
        response.forEach((element) => {
          if (element.status == true) {
            sort.push(element);
          }
        });
        response.forEach((element) => {
          if (element.status == false) {
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

  deleteAllDialog() {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.deleteAll();
      }
      return;
    });
  }
  deleteAll() {
    this.service.deleteAll().subscribe(
      (response) => {
        this.toast.success("Alarmes deletados com sucesso!", "Delete");
        this.findAll();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  updateStatusByIdDialog(id: number, status: boolean) {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.updateStatusById(id, status);
      }
    });
  }

  updateStatusById(id: number, status: boolean) {
    this.service.updateStatus(id, status).subscribe(
      (response) => {
        this.toast.success("Alarme editado com sucesso!", "Update");
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
    });
  }

  deleteById(id: number) {
    this.service.deleteById(id).subscribe(
      (response) => {
        this.toast.success("Alarme deletado com sucesso!", "Delete");
        this.findAll();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  findAlunoById(id: number) {
    this.router.navigate([`/aluno/${id}`]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
