import { MatDialog } from "@angular/material/dialog";
import { OcorrenciaFORM } from "./../../../models/OcorrenciaFORM";
import { ActivatedRoute } from "@angular/router";
import { OcorrenciaService } from "./../../../services/ocorrencia.service";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";
import { FormControl, Validators } from "@angular/forms";
import { DialogComponent } from "../../dialog/dialog.component";

@Component({
  selector: "app-ocorrencia-create",
  templateUrl: "./ocorrencia-create.component.html",
  styleUrls: ["./ocorrencia-create.component.css"],
})
export class OcorrenciaCreateComponent implements OnInit {
  idAluno: number;
  ocorrencia: OcorrenciaFORM = {
    id: null,
    privado: null,
    data: new Date(),
    tipo: "",
    descricao: "",
    bloqueio: null,
  };

  constructor(
    private service: OcorrenciaService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.idAluno = parseInt(this.route.snapshot.paramMap.get("id"));
  }

  tipo: FormControl = new FormControl(null, Validators.required);
  descricao: FormControl = new FormControl(null, Validators.minLength(10));
  bloqueio: FormControl = new FormControl(null, Validators.required);
  privado: FormControl = new FormControl(null, Validators.required);

  createDialog() {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.create();
      } else {
        return;
      }
    });
  }

  create(): void {
    this.service.create(this.idAluno, this.ocorrencia).subscribe(
      (response) => {
        this.toast.success("Ocorrência registrada com sucesso!", "Create");
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

  return() {
    this.location.back();
  }
}
