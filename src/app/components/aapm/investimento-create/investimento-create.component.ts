import { DialogComponent } from "./../../dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { InvestimentoAapm } from "./../../../models/InvestimentoAapm";
import { ToastrService } from "ngx-toastr";
import { AapmService } from "src/app/services/aapm.service";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-investimento-create",
  templateUrl: "./investimento-create.component.html",
  styleUrls: ["./investimento-create.component.css"],
})
export class InvestimentoCreateComponent implements OnInit {
  investimento: InvestimentoAapm = {
    id: null,
    data: "",
    investimento: "",
    valor: null,
  };
  constructor(
    private service: AapmService,
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
      }
    });
  }

  create(): void {
    this.service.investimentoCreate(this.investimento).subscribe(
      (response) => {
        this.toast.success("Investimento criado com sucesso", "Create");
        this.dialog.closeAll();
      },
      (ex) => {
        this.toast.error(ex.error.error, "Error");
      }
    );
  }
}
