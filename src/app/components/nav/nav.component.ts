
import { MatDialog } from "@angular/material/dialog";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs";

import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { UploadFilesComponent } from "src/app/components/upload-files/upload-files.component";
import { AlunoService } from "src/app/services/aluno.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  usuarioLogado: string;
  perfilUsuario: string;
  panelOpenState = false;
  showFiller = true;
  alunoTag: number = null;
  debounce: Subject<number> = new Subject<number>();
  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastrService,
    private dialog: MatDialog,
    private alunoService: AlunoService
  ) {}

  ngOnInit(): void {
    this.router.navigate(["home"]);
    this.getUsuarioLogado();
    this.getPerfilUsuario();
    this.debounce.pipe(debounceTime(300)).subscribe(() => {
      this.alunoService.findByTag(this.alunoTag).subscribe(
        (response) => {
          this.router.navigate([`/aluno/${response.id}`], {});
        },
        (ex) => {
          this.toast.error(ex.error.error, "Error");
        }
      );
    });
  }

  logoutDialog() {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.logout();
      } else {
        return;
      }
    });
  }

  logout() {
    this.router.navigate(["login"]);
    this.authService.logout();
    this.toast.info("Logout realizado com sucesso", "Logout", {
      timeOut: 7000,
    });
  }

  getUsuarioLogado() {
    this.usuarioLogado = localStorage.getItem("usuario");
  }

  getPerfilUsuario() {
    const perfil = localStorage.getItem("perfis");
    if (perfil.includes("ADMIN")) {
      this.perfilUsuario = "ADMIN";
      return;
    } else if (perfil.includes("OPERATOR")) {
      this.perfilUsuario = "OPERATOR";
      return;
    } else if (perfil.includes("USER")) {
      this.perfilUsuario = "USER";
      return;
    }
    return null;
  }
  imageUpload(): void {
    let dialog = this.dialog.open(UploadFilesComponent, {
      data: { folder: "login", name: `login_background` },
    });
    dialog.afterClosed().subscribe((response) => {
      if (response) {
        return;
      }
    });
  }

  findAlunoByTag() {
    if (this.alunoTag) {
      this.debounce.next(this.alunoTag);
      return;
    }
    return;
  }
}
