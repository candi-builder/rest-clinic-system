export class AddPoliRequest {
  name: string;
}

export class PoliResponse {
  id: bigint;
  poli_name: string;
  doctor?: string;
}
