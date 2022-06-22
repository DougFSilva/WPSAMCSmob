import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AapmService } from "src/app/services/aapm.service";
import { Location } from "@angular/common";
import { AapmFORM } from "src/app/models/AapmFORM";
import { DialogComponent } from "../../dialog/dialog.component";

@Component({
  selector: "app-aapm-create",
  templateUrl: "./aapm-create.component.html",
  styleUrls: ["./aapm-create.component.css"],
})
export class AapmCreateComponent implements OnInit {
  idAluno: number;
  aapm: AapmFORM = {
    id: null,
    dataPagamento: "",
    semestre: "",
    recibo: "",
    valor: null,
  };

  dataPagamento: FormControl = new FormControl(null, Validators.required);
  semestre: FormControl = new FormControl(null, Validators.required);
  valor: FormControl = new FormControl(null, Validators.required);

  constructor(
    private service: AapmService,
    private toast: ToastrService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.idAluno = parseInt(this.route.snapshot.paramMap.get("id"));
  }

  validator(): boolean {
    return this.dataPagamento.valid && this.semestre.valid && this.valor.valid;
  }

  createDialog(): void {
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
    this.service.create(this.idAluno, this.aapm).subscribe(
      (response) => {
        this.toast.success("Pagamento adicionado com sucesso!", "Create");
        this.location.back();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  return() {
    this.location.back();
  }
}
