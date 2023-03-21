import {HttpErrorResponse} from "@angular/common/http";
import {ErrorHandler, Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class GlobalErrorHandler implements ErrorHandler {
  constructor() {}

  ignoreMessages: string[] = [
    'Invalid Jalali year'
  ]

  handleError(error: Error | HttpErrorResponse) {
    // if(this.ignoreMessages.find(x => error.message.includes(x))) return;
    console.error(error)
  }
}
