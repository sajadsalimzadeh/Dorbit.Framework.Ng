import moment from "moment";

interface Filter {
  key: string;
  op: 'eq' | 'like';
  value: any;
}

export class ODataQueryOptions {
  private _filter: string = '';
  private _select: string = '';
  private _orderBy: string = '';
  private _skip: number = 0;
  private _top: number = 0;

  queryParams: any = {};

  filterBy(op: 'or' | 'and', filters: Filter[]): ODataQueryOptions {
    const filterGroup = filters.filter(x => x.value !== undefined && x.value !== null && x.value.toString().trim()).map(filter => {
      if (typeof filter.value === 'string') return `${filter.key} ${filter.op} "${filter.value}"`;
      return `${filter.key} ${filter.op} ${filter.value}`;
    });
    if (filterGroup.length > 0) {
      if (this._filter) this._filter += ` and `;
      this._filter += `${filterGroup.length > 1 ? '(' : ''}${filterGroup.join(` ${op} `)}${filterGroup.length > 1 ? ')' : ''}`;
    }
    return this;
  }

  orderBy(order: string, dir: 'asc' | 'desc' = 'asc') {
    this._orderBy = order + ' ' + dir;
    return this;
  }

  clearFilter(): ODataQueryOptions {
    this._filter = '';
    return this;
  }

  selectBy(...fields: string[]) {
    if (this._select) this._select += ',';
    this._select += fields.join(',');
    return this;
  }

  clearOrderBy(): ODataQueryOptions {
    this._orderBy = '';
    return this;
  }

  toQueryString(withQuestionMark: boolean = true): string {
    let params = (withQuestionMark ? "?" : "");
    if (this._filter) params += `$filter=${this._filter}&`;
    if (this._select) params += `$select=${this._select}&`;
    if (this._orderBy) params += `$orderby=${this._orderBy}&`;
    if (this._top) params += `$top=${this._top}&`;
    if (this._skip) params += `$skip=${this._skip}&`;
    params += Object.keys(this.queryParams).map(k => `${k}=${this.queryParams[k]}`).join('&')
    return params;
  }

  toObject(): any {
    return {
      top: this._top,
      skip: this._skip,
      orderby: this._orderBy,
      filter: this._filter
    };
  }

  toJson(): string {
    return JSON.stringify(this.toObject());
  }

  loadJson(json: string | undefined | null): ODataQueryOptions {
    if (json) {
      const obj = JSON.parse(json);
      return this.loadObject(obj);
    }
    return this;
  }

  loadObject(obj: any): ODataQueryOptions {
    if (obj) {
      if (obj._top) this._top = +obj._top;
      if (obj._skip) this._skip = +obj._skip;
      if (obj.orderby) this._orderBy = obj.orderby;
      if (obj._filter) this._filter = obj._filter;
    }
    return this;
  }

  loadFromLocalStorage(): ODataQueryOptions {
    const json = localStorage.getItem(window.location.pathname + '-odata-query-options');
    return this.loadJson(json);
  }

  loadFromQueryString(): ODataQueryOptions {
    const params = new URLSearchParams(window.location.search);
    const top = params.get('top');
    const skip = params.get('skip');
    const orderby = params.get('orderby');
    const filter = params.get('filter');

    if (top) this._top = +top;
    if (skip) this._skip = +skip;
    if (orderby) this._orderBy = orderby;
    if (filter) this._filter = filter;

    return this;
  }

  saveToLocalStorage(): ODataQueryOptions {
    localStorage.setItem(window.location.pathname + '-odata-query-options', this.toJson());
    return this;
  }

  saveToQueryString(): ODataQueryOptions {
    const params = new URLSearchParams(window.location.search);
    if (this._top) params.set('top', this._top.toString());
    if (this._skip) params.set('skip', this._skip.toString());
    if (typeof this._orderBy === 'string') {
      if (this._orderBy) params.set('orderby', this._orderBy);
      else if (params.has('orderby')) params.delete('orderby');
    }
    if (typeof this._filter === 'string') {
      if (this._filter) params.set('filter', this._filter);
      else if (params.has('filter')) params.delete('filter');
    }

    if (window.history.pushState) {
      const queryString = params.toString();
      if (queryString || window.location.search) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + queryString;
        window.history.pushState({path: newurl}, '', newurl);
      }
    }
    return this;
  }

  getFilters(): any {
    const result: any = {};
    const filterSplit = this._filter.split(/(and|or)/);

    for (const key in filterSplit) {
      const item = filterSplit[key];
      const itemSplit = item.split(/(eq|ne|gt|ge|lt|le|add|sub|mul|div|mod|like)/);
      if (itemSplit.length === 3) {
        const key = itemSplit[0].trim();
        let value: any = itemSplit[2].trim();
        if (value[0] === '"') {
          value = value.substr(1, value.length - 2);
          if (value.match(/\d\d\d\d[/-]\d\d[/-]\d\d.*/)) {
            moment.locale('en');
            value = moment(value);
          }
          result[key] = value;
        } else {
          const numberValue = parseInt(value);
          if (numberValue) result[key] = numberValue;
          else result[key] = value;
        }
      }
    }
    return result;
  }
}
