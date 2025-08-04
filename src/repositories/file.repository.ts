import { Injectable, Injector } from '@angular/core';
import { BaseApiRepository } from "./base-api.repository";
import { QueryResult } from "../contracts/results";
import { BASE_URL_FRAMEWORK } from '../configs';
import { HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileRepository extends BaseApiRepository {

    constructor(injector: Injector) {
        super(injector, injector.get(BASE_URL_FRAMEWORK), 'Files');
    }

    upload(data: File | Blob, name: string, progress?: (progress: number) => void) : Observable<QueryResult<string>> {
        const formData = new FormData();
        formData.append('file', data, name);
        return new Observable<QueryResult<string>>(observer => {
            this.http.post<QueryResult<string>>('', formData, { reportProgress: true, observe: 'events' }).subscribe({
                next: (event) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        progress?.(event.loaded / event.total!);
                    } else if (event.type === HttpEventType.Response) {
                        observer.next(event.body!);
                    }
                },
                error: (error) => {
                    observer.error(error);
                },
                complete: () => {
                    observer.complete();
                }
            });
        });
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

        const blob = new Blob(byteArrays, { type: '' });
        return this.upload(blob, name);
    }

    download(filename: string) {
        return this.http.get(`${filename}/Download`, { responseType: 'arraybuffer' });
    }
}
