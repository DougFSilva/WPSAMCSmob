import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Curso } from 'src/app/models/Curso';
import { CursoService } from 'src/app/services/curso.service';

@Component({
  selector: 'app-curso-create',
  templateUrl: './curso-create.component.html',
  styleUrls: ['./curso-create.component.css'],
})
export class CursoCreateComponent implements OnInit {
  curso: Curso = {
    id: null,
    modalidade: '',
    areaTecnologica: '',
    turma: [],
    imagem: '',
  };

  uploadFile: any;
  constructor(
    private service: CursoService,
    private toast: ToastrService,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  modalidade: FormControl = new FormControl(null, Validators.minLength(2));
  areaTecnologica: FormControl = new FormControl(null, Validators.minLength(2));

  validaCampos(): boolean {
    return this.modalidade.valid && this.areaTecnologica.valid;
  }

  createDialog() {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == 'true') {
        this.create();
      } else {
        return;
      }
    });
  }

  create(): void {
    this.service.create(this.curso).subscribe(
      () => {
        this.toast.success('Curso cadastrado com sucesso!', 'Create');
        this.location.back();
      },
      (ex) => {
        if (ex.status === 403) {
          this.toast.error(
            'Você não tem autorização para essa operação',
            'Error'
          );
          return;
        }
        this.toast.error(ex.error.error, 'Error');
      }
    );
  }

  return(): void {
    this.location.back();
  }
}
