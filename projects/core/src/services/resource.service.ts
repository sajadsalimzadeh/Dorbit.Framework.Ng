
class ResourceService {
  resources: any = {};

  get(name: string) {
    return this.resources[name];
  }

  load(name: string, url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.resources[name]) {
        resolve(this.resources[name]);
        return;
      }
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            const res = JSON.parse(xhr.responseText);
            this.resources[name] = res;
            resolve(res);
          } else {
            reject();
          }
        }
      });
      xhr.send();
    })
  }

  merge(name: string, ...sources: string[]) {
    const resource: any = {};
    sources.forEach(x => Object.assign(resource, this.resources[x]));
    return this.resources[name] = resource;
  }
}

export const resourceService = new ResourceService();
