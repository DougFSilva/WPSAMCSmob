import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { UsuarioFORM } from 'src/app/models/UsuarioFORM';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuario-update',
  templateUrl: './usuario-update.component.html',
  styleUrls: ['./usuario-update.component.css'],
})
export class UsuarioUpdateComponent implements OnInit {
  id: number;
  perfil: string = '';
  usuario: UsuarioFORM = {
    id: null,
    nome: '',
    empresa: '',
    username: '',
    password: '',
    perfis: [],
  };

  nome: FormControl = new FormControl(null, Validators.minLength(5));
  empresa: FormControl = new FormControl(null, Validators.minLength(2));
  username: FormControl = new FormControl(null, Validators.minLength(5));

  constructor(
    private service: UsuarioService,
    private dialog: MatDialog,
    private toast: ToastrService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.findUserById();
  }

  findUserById(): void {
    this.service.findById(this.id).subscribe(
      (response) => {
        this.usuario = response;
      },
      (ex) => {
        this.toast.error(ex.error.error, 'Error');
      }
    );
  }

  updateDialog() {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == 'true') {
        this.update();
      }
    });
  }

  update() {
    this.usuario.perfis = [
      {
        tipo: this.perfil,
      },
    ];
    this.service.updateById(this.id, this.usuario).subscribe(
      () => {
        this.toast.success('Usuário editado com sucesso!', 'Update');
        this.return();
      },
      (ex) => {
        this.toast.error(ex.error.error);
      }
    );
  }

  validaCampos(): boolean {
    return this.nome.valid && this.empresa.valid && this.username.valid;
  }

  return() {
    this.location.back();
  }
}
