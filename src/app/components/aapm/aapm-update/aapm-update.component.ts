import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AapmService } from 'src/app/services/aapm.service';
import { Location } from '@angular/common';
import { AapmFORM } from 'src/app/models/AapmFORM';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-aapm-update',
  templateUrl: './aapm-update.component.html',
  styleUrls: ['./aapm-update.component.css']
})
export class AapmUpdateComponent implements OnInit {

  id: number
  aapm:AapmFORM = {
    id:null,
    dataPagamento: '',
    semestre: '',
    recibo : '',
    valor : null
  }

  dataPagamento:FormControl = new FormControl(null, Validators.required)
  semestre:FormControl = new FormControl(null, Validators.required)
  valor: FormControl = new FormControl(null, Validators.required)
  constructor(
    private service: AapmService,
    private toast: ToastrService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'))
    this.findbyId();
  } 

  validator():boolean{
    return (this.dataPagamento.valid &&
            this.semestre.valid &&
            this.valor.valid)
  }

  updateDialog():void {
    let dialog = this.dialog.open(DialogComponent)
    dialog.afterClosed().subscribe(response=>{
      if(response ==  'true'){
        this.update()
      }else{
        return
      }
    })
  }
  update():void {
   this.service.update(this.aapm).subscribe(response =>{
     this.toast.success('Pagamento da AAPM editado com sucesso!', 'Error')
     this.location.back()
   },(ex)=>{
     this.toast.error(ex.error.error, 'Error')
   })
  }

  findbyId():void{
    this.service.findById(this.id).subscribe(response =>{
      this.aapm = response
    }, (ex)=>{
      this.toast.error(ex.error.error, 'Error')
    })
  }

  return(){
    this.location.back()
  }
}

