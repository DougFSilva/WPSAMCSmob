import { FormControl, Validators } from "@angular/forms";
import { Funcionario } from "./../../../models/Funcionario";
import { DialogComponent } from "./../../dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { FuncionarioService } from "./../../../services/funcionario.service";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-funcionario-create",
  templateUrl: "./funcionario-create.component.html",
  styleUrls: ["./funcionario-create.component.css"],
})
export class FuncionarioCreateComponent implements OnInit {
  funcionario: Funcionario = {
    id: null,
    nome: "",
    sexo: "",
    idade: null,
    rg: "",
    email: "",
    telefone: "",
    cidade: "",
    dataNascimento: "",
    tag: null,
    entradaSaida: "LIVRE_ACESSO",
    matricula: null,
    empresa: "",
    foto: "",
  };

  nome: FormControl = new FormControl(null, Validators.minLength(5));
  sexo: FormControl = new FormControl(null, Validators.minLength(1));
  rg: FormControl = new FormControl(null, Validators.minLength(7));
  matricula: FormControl = new FormControl(null, Validators.minLength(4));
  empresa: FormControl = new FormControl(null, Validators.minLength(3));

  constructor(
    private service: FuncionarioService,
    private toast: ToastrService,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  createDialog(): void {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.create();
        return;
      }
      return;
    });
  }

  create(): void {
    this.service.create(this.funcionario).subscribe(
      (response) => {
        this.toast.success("Funcionário criado com sucesso!", "Create");
        this.return();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  validaCampos(): boolean {
    return (
      this.nome.valid &&
      this.sexo.valid &&
      this.rg.valid &&
      this.matricula.valid &&
      this.empresa.valid
    );
  }

  return(): void {
    this.location.back();
  }
}
