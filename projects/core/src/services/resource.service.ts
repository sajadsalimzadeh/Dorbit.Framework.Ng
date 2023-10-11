class ResourceService {
  resources: any = {};

  get(name: string) {
    return this.resources[name];
  }

  async load(name: string, url: string): Promise<any> {
    if (this.resources[name]) {
      return this.resources[name];
    }
    const res = await fetch(url);
    this.resources[name] = await res.json();
    return this.resources[name];
  }

  merge(name: string, ...sources: string[]) {
    const resource: any = {};
    sources.forEach(x => Object.assign(resource, this.resources[x]));
    return this.resources[name] = resource;
  }
}

export const resourceService = new ResourceService();
