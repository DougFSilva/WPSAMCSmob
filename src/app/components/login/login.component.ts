import { UsuarioLogado } from "./../../models/UsuarioLogado";
import { AuthService } from "../../services/auth.service";
import { Autenticacao } from "./../../models/Autenticacao";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  auth: Autenticacao = {
    username: "",
    password: "",
  };

  usuarioLogado: UsuarioLogado;

  username = new FormControl(null, Validators.minLength(4));
  password = new FormControl(null, Validators.minLength(5));

  constructor(
    private toast: ToastrService,
    private service: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logar() {
    this.service.authenticate(this.auth).subscribe(
      (response) => {
        this.service.successfullLogin(response);
        this.router.navigate(["home"]);
        this.toast.success("Seja bem-vindo(a)!", "Login");
      },
      () => this.toast.error("Usuário e/ou senha inválidas", "Error")
    );
  }
  validaCampos(): boolean {
    return this.username.valid && this.password.valid;
  }
}
