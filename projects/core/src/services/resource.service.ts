
class ResourceService {
  resources: any = {};

  get(name: string) {
    return this.resources[name];
  }

  load(name: string, url: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.resources[name]) {
        resolve(this.resources[name]);
        return;
      }
      this.resources[name] = await fetch(url);
      resolve(this.resources[name]);
    })
  }

  merge(name: string, ...sources: string[]) {
    const resource: any = {};
    sources.forEach(x => Object.assign(resource, this.resources[x]));
    return this.resources[name] = resource;
  }
}

export const resourceService = new ResourceService();
