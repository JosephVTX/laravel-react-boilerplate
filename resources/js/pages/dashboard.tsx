import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ApiError, api } from '@/lib/api';
import { authSchema } from '@/lib/schemas';
import { me } from '@/routes/api';

export default function Dashboard() {
    const [session, setSession] = useState<App.Data.Shared.AuthData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Ejemplo del patron JSON tipado: axios + zod validado contra el tipo generado desde PHP.
    useEffect(() => {
        api.get(me.url(), authSchema)
            .then(setSession)
            .catch((e: unknown) => setError(e instanceof ApiError ? e.message : 'Error desconocido'));
    }, []);

    return (
        <>
            <Head title="Inicio" />
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="card-title text-2xl">Hola, {session?.user?.name ?? '...'}</h2>
                    {error ? <p className="text-error">{error}</p> : null}
                    <p className="opacity-70">Permisos activos: {session?.permissions.length ?? 0}</p>
                    <div className="flex flex-wrap gap-1">
                        {session?.user?.roles.map((role) => (
                            <span key={role} className="badge badge-primary">
                                {role}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
