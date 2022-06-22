import { DialogComponent } from "./../../dialog/dialog.component";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { UsuarioService } from "src/app/services/usuario.service";
import { Component, OnInit } from "@angular/core";
import { UsuarioFORM } from "src/app/models/UsuarioFORM";
import { FormControl, Validators } from "@angular/forms";
import { Location } from "@angular/common";

@Component({
  selector: "app-usuario-create",
  templateUrl: "./usuario-create.component.html",
  styleUrls: ["./usuario-create.component.css"],
})
export class UsuarioCreateComponent implements OnInit {
  perfil: string = "";
  usuario: UsuarioFORM = {
    id: null,
    nome: "",
    empresa: "",
    username: "",
    password: "",
    perfis: [],
  };

  nome: FormControl = new FormControl(null, Validators.minLength(5));
  empresa: FormControl = new FormControl(null, Validators.minLength(2));
  username: FormControl = new FormControl(null, Validators.minLength(5));
  password: FormControl = new FormControl(null, Validators.minLength(7));
  perfis: FormControl = new FormControl(null, Validators.required);
  constructor(
    private service: UsuarioService,
    private dialog: MatDialog,
    private toast: ToastrService,
    private location: Location
  ) {}

  ngOnInit(): void {}

  validaCampos(): boolean {
    return (
      this.nome.valid &&
      this.empresa.valid &&
      this.username.valid &&
      this.password.valid &&
      this.perfis.valid
    );
  }

  createDialog() {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe(
      (response) => {
        if (response == "true") {
          this.create();
          return;
        }
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
        return;
      }
    );
  }

  create() {
    this.usuario.perfis = [
      {
        tipo: this.perfil,
      },
    ];
    this.service.create(this.usuario).subscribe(
      (response) => {
        this.toast.success("Usuário criado com sucesso", "Create");
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
