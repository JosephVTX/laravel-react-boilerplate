import type { ReactNode } from 'react';
import { CellValue } from '@/components/crud/CellValue';
import { Icon } from '@/components/ui/Icon';
import type { CrudRow } from '@/types';

type DataTableProps = {
    columns: App.Data.Crud.ColumnData[];
    rows: CrudRow[];
    sort: string;
    onSort: (key: string) => void;
    /** Celda extra al final de cada fila (acciones). */
    actions?: (row: CrudRow) => ReactNode;
};

/** Tabla generica: columnas y tipos de celda vienen del backend (ColumnData). */
export function DataTable({ columns, rows, sort, onSort, actions }: DataTableProps) {
    const sortIcon = (key: string) =>
        sort === key ? 'chevron-up' : sort === `-${key}` ? 'chevron-down' : 'chevrons-up-down';

    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>
                                {column.sortable ? (
                                    <button
                                        type="button"
                                        className="flex items-center gap-1"
                                        onClick={() => onSort(column.key)}
                                    >
                                        {column.label}
                                        <Icon name={sortIcon(column.key)} className="size-3.5 opacity-60" />
                                    </button>
                                ) : (
                                    column.label
                                )}
                            </th>
                        ))}
                        {actions ? (
                            <th className="w-24">
                                <span className="sr-only">Acciones</span>
                            </th>
                        ) : null}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 1} className="py-10 text-center opacity-60">
                                Sin resultados
                            </td>
                        </tr>
                    ) : (
                        rows.map((row) => (
                            <tr key={row.id} className="hover:bg-base-200/50">
                                {columns.map((column) => (
                                    <td key={column.key}>
                                        <CellValue type={column.type} value={row[column.key]} />
                                    </td>
                                ))}
                                {actions ? (
                                    <td className="text-right whitespace-nowrap">{actions(row)}</td>
                                ) : null}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
