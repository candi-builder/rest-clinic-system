export class PaginationData {
	page: number;
	size: number;
	total_page: number;
	total_data: number;
}

export class BaseResponse<T> {
	data?: T;
	pagination?: PaginationData;
	status_code: number;
	message: string;
}
