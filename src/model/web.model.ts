export class WebResponse<T>{
    data?: T;
    message?: string | number;
    status_code?: number;
    errorMessages?: any;

}