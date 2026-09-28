import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { CrudQuery } from '@/types';

type QueryChange = { search?: string; sort?: string; page?: number; per_page?: number };

/**
 * Estado de listado (busqueda, orden, pagina, tamano) sincronizado con la URL en formato spatie/query-builder:
 * `?filter[search]=x&sort=-name&page=2&per_page=15`. Solo recarga las props `rows` y `query`.
 */
export function useCrudQuery(baseUrl: string, query: CrudQuery, defaultSort: string) {
    const [search, setSearch] = useState(query.search);

    const visit = (change: QueryChange) => {
        const next = { ...query, ...change };

        router.get(
            baseUrl,
            {
                filter: next.search ? { search: next.search } : undefined,
                sort: next.sort === defaultSort ? undefined : next.sort,
                page: change.page && change.page > 1 ? change.page : undefined,
                per_page: next.per_page === 15 ? undefined : next.per_page,
            },
            { only: ['rows', 'query'], preserveState: true, preserveScroll: true, replace: true },
        );
    };

    // Busqueda con debounce; al buscar se vuelve a la pagina 1.
    useEffect(() => {
        if (search === query.search) return;
        const timer = setTimeout(() => visit({ search }), 300);
        return () => clearTimeout(timer);
        // Solo debe reaccionar a lo que teclea el usuario.
        // oxlint-disable-next-line react/exhaustive-deps
    }, [search]);

    /** Ciclo de orden: asc -> desc -> orden por defecto. */
    const toggleSort = (key: string) => {
        const next = query.sort === key ? `-${key}` : query.sort === `-${key}` ? defaultSort : key;
        visit({ sort: next });
    };

    return {
        search,
        setSearch,
        sort: query.sort,
        toggleSort,
        goToPage: (page: number) => visit({ page }),
        setPerPage: (perPage: number) => visit({ per_page: perPage }),
    };
}
