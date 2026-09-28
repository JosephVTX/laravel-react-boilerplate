import { Icon } from '@/components/ui/Icon';

type RowActionsProps = {
    canUpdate: boolean;
    canDelete: boolean;
    onEdit: () => void;
    onDelete: () => void;
};

/** Botones editar/eliminar de una fila, segun permisos (CrudMetaData.canUpdate / canDelete). */
export function RowActions({ canUpdate, canDelete, onEdit, onDelete }: RowActionsProps) {
    return (
        <>
            {canUpdate ? (
                <button
                    type="button"
                    className="btn btn-ghost btn-xs btn-square"
                    aria-label="Editar"
                    onClick={onEdit}
                >
                    <Icon name="pencil" className="size-4" />
                </button>
            ) : null}
            {canDelete ? (
                <button
                    type="button"
                    className="btn btn-ghost btn-xs btn-square text-error"
                    aria-label="Eliminar"
                    onClick={onDelete}
                >
                    <Icon name="trash" className="size-4" />
                </button>
            ) : null}
        </>
    );
}
