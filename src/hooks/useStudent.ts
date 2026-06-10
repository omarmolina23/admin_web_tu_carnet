import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudents,
  getStudentById,
  resetBiometric,
  getPhotoRequestsByStudent,
  type StudentsQueryParams,
} from "@/services/Student";
import { toast } from "sonner";

export const useStudents = (params: StudentsQueryParams = {}) => {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
  });
};

export const useStudentById = (student_id?: string) => {
  return useQuery({
    queryKey: ["student", student_id],
    queryFn: () => getStudentById(student_id as string),
    enabled: !!student_id,
  });
};

export const useStudentPhotoRequests = (student_id?: string) => {
  return useQuery({
    queryKey: ["student-photo-requests", student_id],
    queryFn: () => getPhotoRequestsByStudent(student_id as string),
    enabled: !!student_id,
  });
};

export const useResetBiometric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (student_id: string) => resetBiometric(student_id),
    onSuccess: (_data, student_id) => {
      toast.success("Perfil biométrico revertido correctamente.");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", student_id] });
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        "Error al revertir el perfil biométrico.";
      toast.error(msg);
    },
  });
};
