import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class ConfigurationService {

  root: any;

  constructor(private http: HttpClient) {}

  load(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.root) {
        resolve(this.root);
        return;
      }
      this.http.get<any>(url).subscribe(res => {
        this.root = res;
        resolve(this.root);
      }, e => reject(e));
    })
  }
}
