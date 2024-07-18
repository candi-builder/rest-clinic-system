export class Utils {
	static formatDate(date: Date): string {
		const year = date.getFullYear().toString();
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const day = date.getDate().toString().padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	static convertStringToNumber(value: string): number {
		return Number(value);
	}
}

export enum StatusPassien {
	EXISTING_BPJS_NUMBER = "Pasien sudah terdaftar",
	SUCCESS_REGISTER_PASSIEN = "Pasien berhasil terdaftar",
}
