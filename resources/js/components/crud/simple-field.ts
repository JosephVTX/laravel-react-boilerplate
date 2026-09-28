/** Crea un FieldData minimo para reutilizar FieldInput fuera del CRUD (login, registro, ajustes...). */
export function simpleField(
    name: string,
    label: string,
    type: App.Enums.FieldType = 'text',
    required = true,
): App.Data.Crud.FieldData {
    return {
        name,
        label,
        type,
        required,
        requiredOnCreateOnly: false,
        options: [],
        placeholder: null,
        hint: null,
    };
}
