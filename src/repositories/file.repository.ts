import {Inject, Injectable, Injector} from '@angular/core';
import {BaseApiRepository} from "./base-api.repository";
import {QueryResult} from "../contracts/results";
import {BASE_FRAMEWORK_URL} from '../framework';

@Injectable({providedIn: 'root'})
export class FileRepository extends BaseApiRepository {

    constructor(injector: Injector, @Inject(BASE_FRAMEWORK_URL) baseUrl: string) {
        super(injector, baseUrl, 'Files');
    }

    upload(data: File | Blob, name: string) {
        const formData = new FormData();
        formData.append('file', data, name);
        return this.http.post<QueryResult<string>>('', formData)
    }

    uploadBase64(value: string, name: string) {
        value = value.replace(/.*base64,/, '');
        const byteCharacters = atob(value);
        const byteArrays: Uint8Array[] = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, {type: ''});
        return this.upload(blob, name);
    }

    download(filename: string) {
        return this.http.get(`${filename}/Download`, {responseType: 'arraybuffer'});
    }
}
