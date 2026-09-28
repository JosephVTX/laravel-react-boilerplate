/**
 * Tipos compartidos backend <-> frontend.
 * - Tipos de PHP (Data/Enums) => generados en `./generated.d.ts` (namespace global `App.*`). NO editar a mano.
 * - Contratos genericos (paginacion, props de paginas CRUD) => aqui, espejo de app/Support/Paginated.php
 *   y app/Http/Controllers/CrudController.php.
 */

export type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

export type Paginated<T> = {
    data: T[];
    meta: PaginationMeta;
};

/** Fila generica de una tabla CRUD. Para tipar un recurso concreto usar su Data: `CrudRow<App.Data.UserData>`. */
export type CrudRow<T extends object = Record<string, unknown>> = T & { id: number };

export type CrudQuery = {
    search: string;
    sort: string;
    per_page: number;
};

/** Props de la pagina `crud/index` (CrudController::index). */
export type CrudIndexProps<T extends object = Record<string, unknown>> = {
    meta: App.Data.Crud.CrudMetaData;
    rows: Paginated<CrudRow<T>>;
    query: CrudQuery;
};

export type FormValue = string | number | boolean | string[];
export type FormValues = Record<string, FormValue>;
