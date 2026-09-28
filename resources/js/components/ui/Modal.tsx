import { useEffect, useRef, type ReactNode } from 'react';

type ModalProps = {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
    actions?: ReactNode;
};

/** Modal DaisyUI sobre <dialog> nativo (accesible: Esc, foco atrapado). */
export function Modal({ open, title, onClose, children, actions }: ModalProps) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog ref={ref} className="modal" onClose={onClose}>
            <div className="modal-box max-h-[90vh] overflow-y-auto">
                <h3 className="mb-4 text-lg font-bold">{title}</h3>
                {children}
                {actions ? <div className="modal-action">{actions}</div> : null}
            </div>
            <form method="dialog" className="modal-backdrop">
                <button type="submit" aria-label="Cerrar">
                    cerrar
                </button>
            </form>
        </dialog>
    );
}
