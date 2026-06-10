import axios from "axios";

const LIVENESS_BASE_URL = import.meta.env.VITE_LIVENESS_URL;

if (!LIVENESS_BASE_URL) {
  console.warn(
    "[Liveness] VITE_LIVENESS_URL no está definido. Configúralo en tu .env"
  );
}

/**
 * Pide al servicio de liveness un URL firmado a partir de la key.
 */
export const getLivenessPhotoUrl = async (photoKey: string): Promise<string> => {
  if (!photoKey) {
    throw new Error("photoKey vacío");
  }

  // Normaliza la base: tolera que VITE_LIVENESS_URL venga con o sin el
  // segmento "/liveness" (o con barra final). La ruta real del servicio es
  // `<root>/liveness/photo/signedUrl`.
  const base = (LIVENESS_BASE_URL || "")
    .replace(/\/+$/, "")
    .replace(/\/liveness$/, "");

  const { data } = await axios.post<{ url: string }>(
    `${base}/liveness/photo/signedUrl`,
    {
      photoKey,
    }
  );

  if (!data?.url) {
    throw new Error("La respuesta del servicio de liveness no contiene 'url'");
  }

  return data.url;
};