import { useState } from "react";
import { useDebounce } from "use-debounce";
import DataTable from "@/components/Table";
import { studentsColumns } from "./studentsColumns";
import { useStudents } from "@/hooks/useStudent";
import { Input } from "@/components/ui/input";

function StudentsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);

  const { data, isLoading, isError } = useStudents({
    page: 1,
    search: debouncedSearch,
  });

  const rows = data?.students ?? [];

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Estudiantes</h1>
        <p className="text-sm text-muted-foreground">
          Lista de estudiantes registrados. Busca por código, correo o nombre.
        </p>
      </header>

      <div className="w-full sm:max-w-sm">
        <Input
          placeholder="Buscar por código, correo o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
