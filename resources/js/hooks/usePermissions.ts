import { usePage } from '@inertiajs/react';

/** `can('users.create')` segun los permisos de Spatie compartidos en cada pagina. */
export function usePermissions() {
    const { auth } = usePage().props;

    return {
        user: auth.user,
        can: (permission: string) => auth.permissions.includes(permission),
    };
}
