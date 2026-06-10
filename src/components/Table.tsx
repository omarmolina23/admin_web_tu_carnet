import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type Row,
} from "@tanstack/react-table";
import { Fragment, useState, type ReactNode } from "react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  // id de la fila expandida (ej: row.original.id)
  expandedRowId?: string | number | null;
  // Componente que se renderiza debajo de la fila
  ExpandedComponent?: (props: { row: Row<TData> }) => ReactNode;
}

function DataTable<TData>({
  columns,
  data,
  expandedRowId,
  ExpandedComponent,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                {/* Fila principal */}
                <TableRow data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Fila expandida */}
                {expandedRowId ===
                  // @ts-ignore si tu modelo no tiene id, ajusta aquí
                  (row.original as any).id &&
                  ExpandedComponent && (
                    <TableRow>
                      <TableCell colSpan={columns.length}>
                        <ExpandedComponent row={row} />
                      </TableCell>
                    </TableRow>
                  )}
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Sin resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;