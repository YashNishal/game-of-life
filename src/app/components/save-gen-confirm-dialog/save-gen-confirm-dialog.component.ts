import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-save-gen-confirm-dialog',
  templateUrl: './save-gen-confirm-dialog.component.html',
  styleUrls: ['./save-gen-confirm-dialog.component.css']
})
export class SaveGenConfirmDialogComponent {
  public name: string;

  constructor(public messageService : MessageService,public ref: DynamicDialogRef) {}

  public clickHandler() {
    if(this.name === undefined || this.name === ''){
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Please enter a name'});
      return;
    }
    this.ref.close(this.name);
  }

}
