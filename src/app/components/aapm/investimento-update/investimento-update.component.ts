import { DialogComponent } from "./../../dialog/dialog.component";
import { InvestimentoAapm } from "./../../../models/InvestimentoAapm";
import { ToastrService } from "ngx-toastr";
import { AapmService } from "src/app/services/aapm.service";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-investimento-update",
  templateUrl: "./investimento-update.component.html",
  styleUrls: ["./investimento-update.component.css"],
})
export class InvestimentoUpdateComponent implements OnInit {
  investimento: InvestimentoAapm = {
    id: null,
    data: "",
    investimento: "",
    valor: null,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: AapmService,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.findById();
  }

  findById(): void {
    this.service.investimentoFindById(this.data[0]).subscribe(
      (response) => {
        this.investimento = response;
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  updateDialog(): void {
    let dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((response) => {
      if (response == "true") {
        this.update();
      }
    });
  }

  update(): void {
    this.service.investimentoUpdate(this.data[0], this.investimento).subscribe(
      (response) => {
        this.toast.success("Investimento editado com sucesso!", "Update");
        this.dialog.closeAll();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }

  return(): void {
    this.dialog.closeAll();
  }
}
