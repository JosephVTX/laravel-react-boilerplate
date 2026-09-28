import { Icon } from '@/components/ui/Icon';
import { formatDate, formatDateTime } from '@/lib/format';

/** Renderiza el valor de una celda segun `ColumnData.type` (enum PHP ColumnType). */
export function CellValue({ type, value }: { type: App.Enums.ColumnType; value: unknown }) {
    if (value === null || value === undefined || value === '') return <span className="opacity-40">-</span>;

    switch (type) {
        case 'badge':
            return <span className="badge badge-outline">{String(value)}</span>;
        case 'badges': {
            const items = Array.isArray(value) ? value.map(String) : [];
            if (items.length === 0) return <span className="opacity-40">-</span>;
            return (
                <div className="flex flex-wrap gap-1">
                    {items.map((item) => (
                        <span key={item} className="badge badge-sm badge-primary badge-soft">
                            {item}
                        </span>
                    ))}
                </div>
            );
        }
        case 'boolean':
            return value ? (
                <Icon name="circle-check" className="size-4 text-success" />
            ) : (
                <Icon name="x" className="size-4" />
            );
        case 'date':
            return <>{formatDate(String(value))}</>;
        case 'datetime':
            return <>{formatDateTime(String(value))}</>;
        default:
            return <>{String(value)}</>;
    }
}
