import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { FieldInput } from '@/components/crud/FieldInput';
import { Modal } from '@/components/ui/Modal';
import { buildFormSchema, initialValues } from '@/lib/form-schema';
import type { CrudRow, FormValues } from '@/types';

type CrudFormModalProps = {
    meta: App.Data.Crud.CrudMetaData;
    /** `null` = modal cerrado; `'new'` = crear; fila = editar. */
    target: CrudRow | 'new' | null;
    onClose: () => void;
};

/** Formulario generico de crear/editar dibujado desde `meta.fields`. */
export function CrudFormModal({ meta, target, onClose }: CrudFormModalProps) {
    const row = target !== null && target !== 'new' ? target : null;
    const mode = row ? 'edit' : 'create';
    const form = useForm<FormValues>(initialValues(meta.fields, row));

    // Reinicia el formulario cada vez que se abre con otro objetivo.
    useEffect(() => {
        if (target === null) return;
        form.setData(initialValues(meta.fields, row));
        form.clearErrors();
        // eslint-disable-next-line -- solo depende del objetivo abierto
    }, [target]);

    const submit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        form.clearErrors();

        const parsed = buildFormSchema(meta.fields, mode).safeParse(form.data);
        if (!parsed.success) {
            for (const issue of parsed.error.issues) {
                const name = String(issue.path[0] ?? '');
                if (name && !form.errors[name]) form.setError(name, issue.message);
            }
            return;
        }

        const options = { preserveScroll: true, onSuccess: onClose };
        if (row) form.put(`${meta.baseUrl}/${row.id}`, options);
        else form.post(meta.baseUrl, options);
    };

    return (
        <Modal
            open={target !== null}
            title={`${row ? 'Editar' : 'Nuevo'} ${meta.singular.toLowerCase()}`}
            onClose={onClose}
        >
            <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
                {meta.fields.map((field) => (
                    <FieldInput
                        key={field.name}
                        field={field}
                        value={form.data[field.name]}
                        error={form.errors[field.name] ?? form.errors[`${field.name}.0`]}
                        onChange={(value) => form.setData(field.name, value)}
                    />
                ))}
                <div className="modal-action">
                    <button type="button" className="btn" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={form.processing}>
                        {form.processing ? <span className="loading loading-spinner loading-sm" /> : null}
                        Guardar
                    </button>
                </div>
            </form>
        </Modal>
    );
}
