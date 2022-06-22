import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { OcorrenciaService } from "src/app/services/ocorrencia.service";
import { Location } from "@angular/common";
import { Ocorrencia } from "src/app/models/Ocorrencia";
import { FormControl, Validators } from "@angular/forms";
import { DialogComponent } from "../../dialog/dialog.component";

@Component({
  selector: "app-ocorrencia-update",
  templateUrl: "./ocorrencia-update.component.html",
  styleUrls: ["./ocorrencia-update.component.css"],
})
export class OcorrenciaUpdateComponent implements OnInit {
  id: number;
  ocorrencia: Ocorrencia = {
    id: null,
    privado: false,
    data: new Date(),
    tipo: "",
    registrador: "",
    aluno: "",
    descricao: "",
    bloqueio: null,
  };

  constructor(
    private route: ActivatedRoute,
    private service: OcorrenciaService,
    private toast: ToastrService,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.id = parseInt(this.route.snapshot.paramMap.get("id"));
    this.findById();
  }

  tipo: FormControl = new FormControl(null, Validators.required);
  descricao: FormControl = new FormControl(null, Validators.minLength(10));
  bloqueio: FormControl = new FormControl(null, Validators.required);
  privado: FormControl = new FormControl(null, Validators.required);

  findById(): void {
    this.service.findById(this.id).subscribe(
      (response) => {
        console.log(response);
        this.ocorrencia = response;
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  saveDialog() {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.save();
      } else {
        return;
      }
    });
  }

  save(): void {
    this.service.update(this.id, this.ocorrencia).subscribe(
      (response) => {
        this.toast.success("Ocorrencia editada com sucesso!", "Update");
        this.location.back();
      },
      (ex) => {
        if (ex.status === 403) {
          this.toast.error(
            "Você não tem autorização para essa operação",
            "Error"
          );
          return;
        }
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  validaCampos(): boolean {
    return (
      this.tipo.valid &&
      this.descricao.valid &&
      this.privado.valid &&
      this.bloqueio.valid
    );
  }

  return(): void {
    this.location.back();
  }
}
