import { Head, Link } from '@inertiajs/react';

const messages: Record<number, string> = {
    403: 'No tienes permiso para ver esta pagina.',
    404: 'La pagina que buscas no existe.',
    500: 'Ocurrio un error en el servidor.',
    503: 'Servicio en mantenimiento. Vuelve en unos minutos.',
};

export default function ErrorPage({ status }: { status: number }) {
    return (
        <>
            <Head title={String(status)} />
            <div className="text-center">
                <p className="text-6xl font-bold">{status}</p>
                <p className="my-4">{messages[status] ?? 'Error inesperado.'}</p>
                <Link href="/" className="btn btn-primary btn-sm">
                    Volver al inicio
                </Link>
            </div>
        </>
    );
}
