import { Modal } from '@/components/ui/Modal';

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    processing?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Eliminar',
    processing = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <Modal
            open={open}
            title={title}
            onClose={onCancel}
            actions={
                <>
                    <button type="button" className="btn" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button type="button" className="btn btn-error" disabled={processing} onClick={onConfirm}>
                        {processing ? <span className="loading loading-spinner loading-sm" /> : null}
                        {confirmLabel}
                    </button>
                </>
            }
        >
            <p>{message}</p>
        </Modal>
    );
}
