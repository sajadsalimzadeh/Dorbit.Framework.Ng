import { HttpErrorResponse } from "@angular/common/http";
import {ErrorHandler, Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class GlobalErrorHandler implements ErrorHandler {
  constructor() {
  }

  handleError(error: Error | HttpErrorResponse) {
    console.error()
  }
}
