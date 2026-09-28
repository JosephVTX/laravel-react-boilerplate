import type { FormValue } from '@/types';

type FieldInputProps = {
    field: App.Data.Crud.FieldData;
    value: FormValue | undefined;
    error?: string;
    onChange: (value: FormValue) => void;
};

/** Control de formulario segun `FieldData.type` (enum PHP FieldType). Incluye label, hint y error. */
export function FieldInput({ field, value, error, onChange }: FieldInputProps) {
    const id = `field-${field.name}`;
    const invalid = error ? 'input-error select-error textarea-error' : '';
    const label = `${field.label}${field.required ? ' *' : ''}`;

    let control;

    switch (field.type) {
        case 'checkbox':
            control = (
                <label className="label cursor-pointer justify-start gap-3">
                    <input
                        id={id}
                        type="checkbox"
                        className="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                    <span>{field.label}</span>
                </label>
            );
            break;
        case 'multiselect': {
            const selected = Array.isArray(value) ? value : [];
            control = (
                <fieldset className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                    {field.options.length === 0 ? (
                        <span className="text-sm opacity-60">Sin opciones</span>
                    ) : null}
                    {field.options.map((option) => {
                        const active = selected.includes(option.value);
                        return (
                            <button
                                key={option.value}
                                type="button"
                                aria-pressed={active}
                                className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() =>
                                    onChange(
                                        active
                                            ? selected.filter((v) => v !== option.value)
                                            : [...selected, option.value],
                                    )
                                }
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </fieldset>
            );
            break;
        }
        case 'select':
            control = (
                <select
                    id={id}
                    className={`select w-full ${invalid}`}
                    value={String(value ?? '')}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="">Seleccionar...</option>
                    {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
            break;
        case 'textarea':
            control = (
                <textarea
                    id={id}
                    className={`textarea w-full ${invalid}`}
                    placeholder={field.placeholder ?? undefined}
                    value={String(value ?? '')}
                    onChange={(e) => onChange(e.target.value)}
                />
            );
            break;
        default:
            control = (
                <input
                    id={id}
                    type={field.type}
                    className={`input w-full ${invalid}`}
                    placeholder={field.placeholder ?? undefined}
                    autoComplete={field.type === 'password' ? 'new-password' : 'off'}
                    value={String(value ?? '')}
                    onChange={(e) => onChange(e.target.value)}
                />
            );
    }

    return (
        <div className="flex flex-col gap-1">
            {field.type === 'checkbox' ? null : (
                <label id={`${id}-label`} htmlFor={id} className="text-sm font-medium">
                    {label}
                </label>
            )}
            {control}
            {field.hint && !error ? <p className="text-xs opacity-60">{field.hint}</p> : null}
            {error ? (
                <p className="text-error text-xs" role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
