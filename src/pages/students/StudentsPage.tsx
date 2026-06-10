import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import DataTable from "@/components/Table";
import { studentsColumns } from "./studentsColumns";
import { useStudents } from "@/hooks/useStudent";
import { Input } from "@/components/ui/input";

type StatusFilter = "TODOS" | "PENDIENTE" | "APROBADO" | "RECHAZADO" | "SIN_PERFIL";

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "TODOS", label: "Todos los estados" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "APROBADO", label: "Aprobado" },
  { value: "RECHAZADO", label: "Rechazado" },
  { value: "SIN_PERFIL", label: "Sin perfil" },
];

function StudentsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS");

  const { data, isLoading, isError } = useStudents({
    page: 1,
    search: debouncedSearch,
  });

  const rows = useMemo(() => {
    const students = data?.students ?? [];
    if (statusFilter === "TODOS") return students;
    if (statusFilter === "SIN_PERFIL") {
      return students.filter((s) => !s.biometric_profile);
    }
    return students.filter(
      (s) => s.biometric_profile?.status === statusFilter
    );
  }, [data?.students, statusFilter]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Estudiantes</h1>
        <p className="text-sm text-muted-foreground">
          Lista de estudiantes registrados. Busca por código, correo o nombre y
          filtra por estado biométrico.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-sm">
          <Input
            placeholder="Buscar por código, correo o nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] sm:w-56"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p>Cargando estudiantes...</p>
      ) : isError ? (
        <p>Ocurrió un error al cargar los estudiantes.</p>
      ) : (
        <DataTable columns={studentsColumns} data={rows} />
      )}
    </div>
  );
}

export default StudentsPage;
