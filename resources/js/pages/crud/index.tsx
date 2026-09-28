import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { CrudFormModal } from '@/components/crud/CrudFormModal';
import { DataTable } from '@/components/crud/DataTable';
import { RowActions } from '@/components/crud/RowActions';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Icon } from '@/components/ui/Icon';
import { Pagination } from '@/components/ui/Pagination';
import { useCrudQuery } from '@/hooks/useCrudQuery';
import type { CrudIndexProps, CrudRow } from '@/types';

/**
 * Pagina UNICA para todos los recursos CRUD (config/crud.php). Se dibuja solo con `meta` (columnas, campos,
 * permisos) y `rows`. NO crear paginas por recurso: extender CrudDefinition en PHP.
 */
export default function CrudIndex(props: CrudIndexProps) {
    // `key` reinicia el estado local (busqueda, modales) al navegar entre recursos (users -> roles).
    return <CrudIndexView key={props.meta.slug} {...props} />;
}

function CrudIndexView({ meta, rows, query }: CrudIndexProps) {
    const { search, setSearch, sort, toggleSort, goToPage, setPerPage } = useCrudQuery(
        meta.baseUrl,
        query,
        meta.defaultSort,
    );
    const [target, setTarget] = useState<CrudRow | 'new' | null>(null);
    const [deleting, setDeleting] = useState<CrudRow | null>(null);
    const [processing, setProcessing] = useState(false);

    const confirmDelete = () => {
        if (!deleting) return;
        router.delete(`${meta.baseUrl}/${deleting.id}`, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setDeleting(null);
            },
        });
    };

    return (
        <>
            <Head title={meta.label} />

            <div className="card bg-base-100 shadow">
                <div className="card-body gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="card-title text-2xl">{meta.label}</h2>
                        <div className="flex flex-wrap items-center gap-2">
                            {meta.searchable ? (
                                <label className="input input-sm">
                                    <Icon name="search" className="size-4 opacity-60" />
                                    <input
                                        type="search"
                                        placeholder="Buscar..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </label>
                            ) : null}
                            {meta.canCreate ? (
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setTarget('new')}
                                >
                                    <Icon name="plus" className="size-4" /> Nuevo
                                </button>
                            ) : null}
                        </div>
                    </div>

                    <DataTable
                        columns={meta.columns}
                        rows={rows.data}
                        sort={sort}
                        onSort={toggleSort}
                        actions={
                            meta.canUpdate || meta.canDelete
                                ? (row) => (
                                      <RowActions
                                          canUpdate={meta.canUpdate}
                                          canDelete={meta.canDelete}
                                          onEdit={() => setTarget(row)}
                                          onDelete={() => setDeleting(row)}
                                      />
                                  )
                                : undefined
                        }
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="opacity-70">
                                {rows.meta.from ?? 0}-{rows.meta.to ?? 0} de {rows.meta.total}
                            </span>
                            <select
                                className="select select-xs w-auto"
                                aria-label="Filas por pagina"
                                value={query.per_page}
                                onChange={(e) => setPerPage(Number(e.target.value))}
                            >
                                {[15, 30, 50, 100].map((n) => (
                                    <option key={n} value={n}>
                                        {n} / pag.
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Pagination meta={rows.meta} onPage={goToPage} />
                    </div>
                </div>
            </div>

            <CrudFormModal meta={meta} target={target} onClose={() => setTarget(null)} />

            <ConfirmDialog
                open={deleting !== null}
                title={`Eliminar ${meta.singular.toLowerCase()}`}
                message="Esta accion no se puede deshacer."
                processing={processing}
                onConfirm={confirmDelete}
                onCancel={() => setDeleting(null)}
            />
        </>
    );
}
