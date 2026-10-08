import { Pipe, PipeTransform } from "@angular/core";
import { TranslateUtil } from "@app/utils/translate";
import { TranslationRepository } from "@framework/repositories/translation.repository";

@Pipe({
    name: 'translationDynamic',
    standalone: true
})
export class DynamicTranslationPipe implements PipeTransform {
    constructor(private translationRepository: TranslationRepository) {}

    transform(value: string): string {
        return this.translationRepository.translate(value);
    }
}