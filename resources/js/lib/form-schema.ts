import { z } from 'zod';
import type { FormValues } from '@/types';

/**
 * Construye un schema zod a partir de los FieldData que envia el backend, para validar en el cliente
 * ANTES de enviar. La validacion real y final sigue siendo la del backend (CrudDefinition::rules).
 */
export function buildFormSchema(fields: App.Data.Crud.FieldData[], mode: 'create' | 'edit') {
    const shape: Record<string, z.ZodType> = {};

    for (const field of fields) {
        const mustFill = field.required || (field.requiredOnCreateOnly && mode === 'create');
        let schema: z.ZodType;

        switch (field.type) {
            case 'multiselect':
                schema = z.array(z.string());
                break;
            case 'checkbox':
                schema = z.boolean();
                break;
            case 'email':
                schema = mustFill
                    ? z.email('Correo invalido')
                    : z.union([z.literal(''), z.email('Correo invalido')]);
                break;
            default:
                schema = mustFill ? z.string().trim().min(1, 'Campo obligatorio') : z.string();
        }

        shape[field.name] = schema;
    }

    return z.object(shape);
}

export function initialValues(
    fields: App.Data.Crud.FieldData[],
    row?: Record<string, unknown> | null,
): FormValues {
    const values: FormValues = {};

    for (const field of fields) {
        const current = row?.[field.name];

        if (field.type === 'multiselect') {
            values[field.name] = Array.isArray(current) ? current.map(String) : [];
        } else if (field.type === 'checkbox') {
            values[field.name] = Boolean(current);
        } else if (field.type === 'password') {
            values[field.name] = '';
        } else {
            values[field.name] = current === null || current === undefined ? '' : String(current);
        }
    }

    return values;
}
