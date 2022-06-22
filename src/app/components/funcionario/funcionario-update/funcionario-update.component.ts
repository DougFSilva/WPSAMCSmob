import { DialogComponent } from "./../../dialog/dialog.component";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Funcionario } from "src/app/models/Funcionario";
import { FuncionarioService } from "src/app/services/funcionario.service";

@Component({
  selector: "app-funcionario-update",
  templateUrl: "./funcionario-update.component.html",
  styleUrls: ["./funcionario-update.component.css"],
})
export class FuncionarioUpdateComponent implements OnInit {
  id: number;
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
  sexo: FormControl = new FormControl(null, Validators.minLength(5));
  rg: FormControl = new FormControl(null, Validators.minLength(7));
  matricula: FormControl = new FormControl(null, Validators.minLength(4));
  empresa: FormControl = new FormControl(null, Validators.minLength(3));

  constructor(
    private service: FuncionarioService,
    private toast: ToastrService,
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = parseInt(this.route.snapshot.paramMap.get("id"));
    this.findById();
  }

  findById(): void {
    this.service.findById(this.id).subscribe(
      (response) => {
        this.funcionario = response;
        console.log(response);
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  updateDialog(): void {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      this.update();
      return;
    });
    return;
  }

  update(): void {
    this.service.update(this.funcionario).subscribe(
      (response) => {
        this.toast.success("Funcionário editado com sucesso!", "Update");
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
      this.rg.valid &&
      this.matricula.valid &&
      this.empresa.valid
    );
  }

  return(): void {
    this.location.back();
  }
}
