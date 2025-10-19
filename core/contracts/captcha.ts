export interface CaptchaValidateRequest {
    key: string; // مقداری که سرور میده به عنوان کلید تصویر
    value: string; // مقداری که گاربر وارد میکند
}

export interface CaptchaResponse {
    key: string;
    value: string;
}