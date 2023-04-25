import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class ResourceService {
  private resources: any = {};

  constructor(private http: HttpClient) {
  }

  get(name: string) {
    return this.resources[name];
  }

  load(name: string, url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.resources[name]) {
        resolve(this.resources[name]);
        return;
      }
      this.http.get<any>(url).subscribe(res => {
        this.resources[name] = res;
        resolve(res);
      }, e => reject(e));
    })
  }
}
