import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Location } from "@angular/common";

import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { Curso } from "src/app/models/Curso";
import { CursoService } from "src/app/services/curso.service";

@Component({
  selector: "app-curso-update",
  templateUrl: "./curso-update.component.html",
  styleUrls: ["./curso-update.component.css"],
})
export class CursoUpdateComponent implements OnInit {
  curso: Curso = {
    id: null,
    modalidade: "",
    areaTecnologica: "",
    turma: [],
    imagem: "",
  };

  constructor(
    private service: CursoService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.curso.id = this.route.snapshot.paramMap.get("id");
    this.findById();
  }

  modalidade: FormControl = new FormControl(null, Validators.minLength(2));
  areaTecnologica: FormControl = new FormControl(null, Validators.minLength(2));

  validaCampos(): boolean {
    return this.modalidade.valid && this.areaTecnologica.valid;
  }

  findById() {
    return this.service
      .findById(parseInt(this.curso.id))
      .subscribe((response) => {
        this.curso = response;
      });
  }

  updateDialog() {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.update();
      }
        return;
    });
  }

  update() {
    this.service.update(this.curso.id, this.curso).subscribe(
      (response) => {
        this.curso = response;
        this.toast.success("Curso atualizado com sucesso", "Update");
        this.location.back();
      },
      (ex) => {
        if (ex.status === 403) {
          this.toast.error(
            "Voc?? n??o tem autoriza????o para essa opera????o",
            "Error"
          );
          return;
        }
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  return() {
    this.location.back();
  }
}
