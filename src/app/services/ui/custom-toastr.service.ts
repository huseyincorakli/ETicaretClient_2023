import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CustomToastrService {

  constructor(private toastr: ToastrService) { }

  message(title: string, message: string,messageType:ToastrMessageType,position:ToastrPosition) {
    this.toastr[messageType](message,title,{positionClass:position,timeOut:1750})
  }
}
export enum ToastrMessageType {
  Success = "success",
  Info = "info",
  Warning = "warning",
  Error = "error",
}
export enum ToastrPosition{
  TopRight="toast-top-right",
  TopLeft="toast-top-left",
  BottomRight="toast-bottom-right",
  BottomLeft="toast-bottom-left",
  TopCenter="toast-top-center",
  BottomCenter="toast-bottom-center",
  TopFull="toast-top-full-width",
  BottomFull="toast-bottom-full-width"
}