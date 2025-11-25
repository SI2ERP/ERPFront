

export type Direccion =  {
  id_direccion: number;
  id_cliente: number;
  direccion: string;
  numero: string;
  ciudad: string;
  region: string;
  comuna: string;
  codigo_postal: string;
  etiqueta?: string | null;
}
