import { Component, Inject, OnDestroy } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
declare var $:any

@Component({
  selector: 'app-authorize-menu-dialog',
  templateUrl: './authorize-menu-dialog.component.html',
  styleUrls: ['./authorize-menu-dialog.component.scss']
})
export class AuthorizeMenuDialogComponent extends BaseDialog<AuthorizeMenuDialogComponent>  implements OnDestroy{
  constructor(dialogref:MatDialogRef<AuthorizeMenuDialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any){
    super(dialogref)
  }
    ngOnDestroy(): void {
     
    }
  
  }
  export enum  AuthorizeMenuState{
    Yes,
    No
  }