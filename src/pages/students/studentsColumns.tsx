import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Student, BiometricStatus } from "@/services/Student";

const biometricBadge: Record<BiometricStatus, string> = {
  APROBADO: "bg-green-100 text-green-700",
  PENDIENTE: "bg-amber-100 text-amber-700",
  RECHAZADO: "bg-red-100 text-red-700",
};

export const studentsColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "student_code",
    header: "Código",
    cell: ({ getValue }) => getValue() as string,
  },
  {
    accessorKey: "name",
    header: "Estudiante",
    cell: ({ row }) => {
      const { name, last_name } = row.original;
      return (
        <span>
          {name} {last_name}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Correo",
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "career",
    header: "Programa",
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">
        {getValue() as string}
      </span>
    ),
  },
  {
    id: "biometric",
    header: "Biométrico",
    cell: ({ row }) => {
      const status = row.original.biometric_profile?.status;

      if (!status) {
        return <span className="text-xs text-muted-foreground">Sin perfil</span>;
      }

      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${biometricBadge[status]}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const student = row.original;

      return (
        <Button asChild variant="outline" size="sm" className="cursor-pointer">
          <Link to={`/dashboard/estudiantes/${student.student_id}`}>Ver</Link>
        </Button>
      );
    },
  },
];
