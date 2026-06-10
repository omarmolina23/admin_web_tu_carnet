import { httpClient } from "@/config/axios";

export type BiometricStatus = "PENDIENTE" | "APROBADO" | "RECHAZADO";

export interface BiometricProfile {
  status: BiometricStatus;
}

export interface Student {
  student_id: string;
  student_code: string;
  name: string;
  last_name: string;
  email: string;
  career: string;
  student_type: string;
  status: string;
  card_photo_key: string | null;
  created_at: string;
  biometric_profile: BiometricProfile | null;
}

export interface StudentsQueryParams {
  page?: number;
  search?: string;
}

export interface StudentsListResponse {
  students: Student[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Lista estudiantes con búsqueda opcional (código, email o nombre) y paginación.
 */
export const getStudents = async (
  params: StudentsQueryParams = {}
): Promise<StudentsListResponse> => {
  const { page = 1, search } = params;

  const { data } = await httpClient.get<{
    data: Student[];
    total: number;
    page: number;
    limit: number;
  }>("/api/student", {
    params: {
      page,
      search: search || undefined,
    },
  });

  return {
    students: data.data,
    total: data.total,
    page: data.page,
    limit: data.limit,
  };
};

/**
 * Obtiene un estudiante por su identificador (uuid).
 */
export const getStudentById = async (student_id: string): Promise<Student> => {
  const { data } = await httpClient.get<Student>(
    `/api/student/id/${student_id}`
  );
  return data;
};

/**
 * Reinicia el perfil biométrico del estudiante a PENDIENTE.
 */
export const resetBiometric = async (student_id: string) => {
  const { data } = await httpClient.patch(
    `/api/student/biometric/reset/${student_id}`
  );
  return data;
};

export interface StudentPhotoRequest {
  request_id: string;
  status: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  new_photo_url: string | null;
  rejection_reason: string | null;
  application_date: string;
  response_date: string | null;
}

export interface StudentPhotoRequestsResponse {
  total: number;
  requests: StudentPhotoRequest[];
}

/**
 * Obtiene las solicitudes de cambio de foto de un estudiante.
 */
export const getPhotoRequestsByStudent = async (
  student_id: string
): Promise<StudentPhotoRequestsResponse> => {
  const { data } = await httpClient.get<StudentPhotoRequestsResponse>(
    `/api/photo-request/student/${student_id}`
  );
  return data;
};
