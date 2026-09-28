import { z } from 'zod';

/**
 * Schemas zod de respuestas JSON. `satisfies z.ZodType<T>` obliga a que coincidan con los tipos
 * generados desde PHP: si cambias una clase Data y no actualizas el schema, `npm run typecheck` falla.
 */
export const userSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    roles: z.array(z.string()),
    created_at: z.string(),
}) satisfies z.ZodType<App.Data.UserData>;

export const authSchema = z.object({
    user: userSchema.nullable(),
    permissions: z.array(z.string()),
}) satisfies z.ZodType<App.Data.Shared.AuthData>;
