import * as moment from "moment";

export class ODataQueryOptions {
    public filter: string = '';
    public orderby: string = '';
    public skip: number = 0;
    public top: number = 0;

    constructor(options?: { top?: number, skip?: number, orderBy?: string, filter?: string }) {
        if(options) {
            if(options.top) this.top = options.top;
            if(options.skip) this.skip = options.skip;
            if(options.orderBy) this.orderby = options.orderBy;
            if(options.filter) this.filter = options.filter;
        }
    }

    addFilter(value: string): ODataQueryOptions {
        if (this.filter) this.filter += ' and ';
        this.filter += value;
        return this;
    }
    clearFilter(): ODataQueryOptions {
        this.filter = '';
        return this;
    }
    clearOrderBy(): ODataQueryOptions {
        this.orderby = '';
        return this;
    }
    toQueryString(withQuestionmark: boolean = true): string {
        let params = (withQuestionmark ? "?" : "");
        if (this.filter) params += `$filter=${this.filter}&`;
        if (this.orderby) params += `$orderby=${this.orderby}&`;
        if (this.top) params += `$top=${this.top}&`;
        if (this.skip) params += `$skip=${this.skip}&`;
        return params;
    }
    toObject(): any {
        return {
            top: this.top,
            skip: this.skip,
            orderby: this.orderby,
            filter: this.filter
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
            if (obj.top) this.top = +obj.top;
            if (obj.skip) this.skip = +obj.skip;
            if (obj.orderby) this.orderby = obj.orderby;
            if (obj.filter) this.filter = obj.filter;
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

        if (top) this.top = +top;
        if (skip) this.skip = +skip;
        if (orderby) this.orderby = orderby;
        if (filter) this.filter = filter;

        return this;
    }

    saveToLocalStorage(): ODataQueryOptions {
        localStorage.setItem(window.location.pathname + '-odata-query-options', this.toJson());
        return this;
    }

    saveToQueryString(): ODataQueryOptions {
        const params = new URLSearchParams(window.location.search);
        if (this.top) params.set('top', this.top.toString());
        if (this.skip) params.set('skip', this.skip.toString());
        if (typeof this.orderby === 'string') {
            if (this.orderby) params.set('orderby', this.orderby);
            else if (params.has('orderby')) params.delete('orderby');
        }
        if (typeof this.filter === 'string') {
            if (this.filter) params.set('filter', this.filter);
            else if (params.has('filter')) params.delete('filter');
        }

        if (window.history.pushState) {
            const queryString = params.toString();
            if (queryString || window.location.search) {
                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + queryString;
                window.history.pushState({ path: newurl }, '', newurl);
            }
        }
        return this;
    }
    getFilters(): any {
        const result: any = {};
        const filterSplit = this.filter.split(/(and|or)/);

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
                }
                else {
                    const numberValue = parseInt(value);
                    if(numberValue) result[key] = numberValue;
                    else result[key] = value;
                }
            }
        }
        return result;
    }
}
