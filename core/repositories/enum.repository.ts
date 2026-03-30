import {Injectable, Injector} from "@angular/core";
import {BaseApiRepository} from './base-api.repository';
import {BASE_API_URL_FRAMEWORK} from '../configs';
import {EnumDto} from '../contracts/enums';
import {QueryResult} from '../contracts/results';
import {BehaviorSubject, tap} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class EnumRepository extends BaseApiRepository {
    $enums = new BehaviorSubject<{ [key: string]: EnumDto }>({});

    constructor(injector: Injector) {
        super(injector, injector.get(BASE_API_URL_FRAMEWORK), 'Enums');
    }

    getAll() {
        return this.http.get<QueryResult<{
            [key: string]: EnumDto
        }>>(``).pipe(tap((res: any) => this.$enums.next(res.Data ?? {})));
    }

    get(name: string) {
        return this.http.get<QueryResult<EnumDto>>(`${name}`)
    }
}
