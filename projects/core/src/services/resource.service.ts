import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class ResourceService {
  resources: any = {};

  constructor(private http: HttpClient) {
  }

  get(name: string) {
    return this.resources[name];
  }

  async load(name: string, url: string): Promise<any> {
    return new Promise<any>((resolve) => {

      if (this.resources[name]) {
        return resolve(this.resources[name]);
      }
      this.http.get(url).subscribe(res => {
        this.resources[name] = res;
        resolve(this.resources[name]);
      })
    })
  }

  merge(name: string, ...sources: string[]) {
    const resource: any = {};
    sources.forEach(x => Object.assign(resource, this.resources[x]));
    return this.resources[name] = resource;
  }
}
