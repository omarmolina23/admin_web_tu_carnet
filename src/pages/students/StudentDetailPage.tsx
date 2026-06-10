import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  useStudentById,
  useStudentPhotoRequests,
  useResetBiometric,
} from "@/hooks/useStudent";
import { useLivenessPhotoUrl } from "@/hooks/useLiveness";
import { useRespondPhotoRequest } from "@/hooks/usePhotoRequest";

import type {
  BiometricStatus,
  StudentPhotoRequest,
} from "@/services/Student";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const biometricBadge: Record<BiometricStatus, string> = {
  APROBADO: "bg-green-100 text-green-700",
  PENDIENTE: "bg-amber-100 text-amber-700",
  RECHAZADO: "bg-red-100 text-red-700",
};

const requestBadge: Record<string, string> = {
  APROBADO: "bg-green-100 text-green-700",
  PENDIENTE: "bg-amber-100 text-amber-700",
  RECHAZADO: "bg-red-100 text-red-700",
};

function PhotoBox({
  label,
  photoKey,
}: {
  label: string;
  photoKey: string | null;
}) {
  const { data: url, isLoading, isError } = useLivenessPhotoUrl(photoKey);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-medium text-center">{label}</span>
      {!photoKey ? (
        <span className="text-xs text-muted-foreground">Sin foto</span>
      ) : isLoading ? (
        <span className="text-xs text-muted-foreground">Cargando...</span>
      ) : isError || !url ? (
        <span className="text-xs text-red-600">No se pudo cargar.</span>
      ) : (
        <img
          src={url}
          alt={label}
          className="w-32 h-32 md:w-36 md:h-36 rounded-lg object-cover border shadow-sm"
        />
      )}
    </div>
  );
}

function RequestCard({
  request,
  currentPhotoKey,
  studentId,
}: {
  request: StudentPhotoRequest;
  currentPhotoKey: string | null;
  studentId: string;
}) {
  const queryClient = useQueryClient();
  const { mutate: respond, isPending } = useRespondPhotoRequest();

  const [status, setStatus] = useState<"APROBADO" | "RECHAZADO">("APROBADO");
  const [comment, setComment] = useState("");

  const isPendingRequest = request.status === "PENDIENTE";

  const handleSubmit = () => {
    const trimmed = comment.trim();

    if (status === "RECHAZADO" && !trimmed) {
      toast("Debes indicar el motivo de rechazo.");
      return;
    }

    const responseMessage =
      trimmed ||
      (status === "APROBADO"
        ? "Solicitud aprobada sin comentario adicional."
        : "Solicitud rechazada sin motivo detallado.");

    respond(
      {
        requestId: request.request_id,
        status,
        response_message: responseMessage,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["student-photo-requests", studentId],
          });
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          <span>
            Solicitud del{" "}
            {new Date(request.application_date).toLocaleString("es-CO")}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              requestBadge[request.status] ?? "bg-muted text-muted-foreground"
            }`}
          >
            {request.status}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center">
          <PhotoBox label="Foto actual en carnet" photoKey={currentPhotoKey} />
          <PhotoBox label="Foto solicitada" photoKey={request.new_photo_url} />
        </div>

        {request.rejection_reason && (
          <p className="text-sm text-muted-foreground">
            Motivo de rechazo: {request.rejection_reason}
          </p>
        )}

        {isPendingRequest ? (
          <div className="space-y-4 border-t pt-4">
            <RadioGroup
              value={status}
              onValueChange={(value) =>
                setStatus(value as "APROBADO" | "RECHAZADO")
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="APROBADO" id={`ap-${request.request_id}`} />
                <Label htmlFor={`ap-${request.request_id}`}>Aprobar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="RECHAZADO" id={`re-${request.request_id}`} />
                <Label htmlFor={`re-${request.request_id}`}>Rechazar</Label>
              </div>
            </RadioGroup>

            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comentario (obligatorio si rechazas)..."
              rows={3}
            />

            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? "Enviando..." : "Enviar respuesta"}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground border-t pt-4">
            Esta solicitud ya fue {request.status.toLowerCase()}.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function StudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>();

  const {
    data: student,
    isLoading,
    isError,
  } = useStudentById(studentId);

  const { data: requestsData, isLoading: isRequestsLoading } =
    useStudentPhotoRequests(studentId);

  const { mutate: revert, isPending: isReverting } = useResetBiometric();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return <p className="p-4">Cargando estudiante...</p>;
  }

  if (isError || !student) {
    return (
      <div className="p-4 space-y-2">
        <p className="text-red-600">No se pudo cargar el estudiante.</p>
        <Button asChild variant="outline">
          <Link to="/dashboard/estudiantes">Volver a estudiantes</Link>
        </Button>
      </div>
    );
  }

  const biometricStatus = student.biometric_profile?.status;
  const requests = requestsData?.requests ?? [];

  const handleRevert = () => {
    if (!studentId) return;
    revert(studentId, {
      onSuccess: () => setConfirmOpen(false),
    });
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" className="cursor-pointer">
        <Link to="/dashboard/estudiantes">← Volver a estudiantes</Link>
      </Button>

      {/* Datos del estudiante */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle del estudiante</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <h2 className="font-semibold text-lg">
              {student.name} {student.last_name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Código: {student.student_code}
            </p>
            <p className="text-sm text-muted-foreground">
              Correo: {student.email}
            </p>
            <p className="text-sm text-muted-foreground">
              Programa: {student.career}
            </p>
            <p className="text-sm text-muted-foreground">
              Tipo: {student.student_type}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-sm">Perfil biométrico:</span>
              {biometricStatus ? (
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${biometricBadge[biometricStatus]}`}
                >
                  {biometricStatus}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Sin perfil</span>
              )}
            </div>

            {/* Botón revertir con confirmación */}
            {biometricStatus && (
              <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2 cursor-pointer"
                  >
                    Revertir perfil biométrico
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Revertir perfil biométrico</DialogTitle>
                    <DialogDescription>
                      El estado del perfil biométrico de {student.name}{" "}
                      {student.last_name} volverá a <strong>PENDIENTE</strong>.
                      El estudiante deberá realizar de nuevo la prueba de vida
                      (liveness) al ingresar. No se borra el historial.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="cursor-pointer">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={handleRevert}
                      disabled={isReverting}
                      className="cursor-pointer"
                    >
                      {isReverting ? "Revirtiendo..." : "Confirmar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <PhotoBox
            label="Foto actual en carnet"
            photoKey={student.card_photo_key}
          />
        </CardContent>
      </Card>

      {/* Solicitudes de cambio de foto */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Solicitudes de cambio de foto</h3>

        {isRequestsLoading ? (
          <p className="text-sm text-muted-foreground">Cargando solicitudes...</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Este estudiante no tiene solicitudes de cambio de foto.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <RequestCard
                key={request.request_id}
                request={request}
                currentPhotoKey={student.card_photo_key}
                studentId={student.student_id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDetailPage;
