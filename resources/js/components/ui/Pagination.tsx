import { Icon } from '@/components/ui/Icon';
import type { PaginationMeta } from '@/types';

type PaginationProps = {
    meta: PaginationMeta;
    onPage: (page: number) => void;
};

type PageItem = { key: string; page: number | null };

/** Ventana de paginas: 1 ... actual-1 actual actual+1 ... ultima (page = null es un hueco). */
function pageWindow(current: number, last: number): PageItem[] {
    const pages = [1, current - 1, current, current + 1, last].filter((p) => p >= 1 && p <= last);
    const sorted = [...new Set(pages)].toSorted((a, b) => a - b);
    const items: PageItem[] = [];

    sorted.forEach((page, i) => {
        const previous = sorted[i - 1];
        if (previous !== undefined && page - previous > 1) items.push({ key: `gap-${page}`, page: null });
        items.push({ key: `page-${page}`, page });
    });

    return items;
}

export function Pagination({ meta, onPage }: PaginationProps) {
    if (meta.last_page <= 1) return null;

    return (
        <div className="join">
            <button
                type="button"
                className="btn btn-sm join-item"
                disabled={meta.current_page <= 1}
                onClick={() => onPage(meta.current_page - 1)}
                aria-label="Pagina anterior"
            >
                <Icon name="chevron-left" className="size-4" />
            </button>
            {pageWindow(meta.current_page, meta.last_page).map(({ key, page }) =>
                page === null ? (
                    <span key={key} className="btn btn-sm btn-disabled join-item">
                        ...
                    </span>
                ) : (
                    <button
                        key={key}
                        type="button"
                        className={`btn btn-sm join-item ${page === meta.current_page ? 'btn-active btn-primary' : ''}`}
                        onClick={() => onPage(page)}
                    >
                        {page}
                    </button>
                ),
            )}
            <button
                type="button"
                className="btn btn-sm join-item"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => onPage(meta.current_page + 1)}
                aria-label="Pagina siguiente"
            >
                <Icon name="chevron-right" className="size-4" />
            </button>
        </div>
    );
}
