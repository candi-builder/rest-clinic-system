export class Utils {
  static formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

static convertStringToNumber(value: string): number {
  return Number(value);
}


}

export enum StatusPassien{
  EXISTING_BPJS_NUMBER = "Pasien sudah terdaftar",
}

