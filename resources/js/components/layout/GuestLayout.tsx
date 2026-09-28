import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/Toaster';

/** Layout para paginas publicas (login, registro, errores). */
export default function GuestLayout({ children }: { children: ReactNode }) {
    const { appName } = usePage().props;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-3xl font-bold">{appName}</h1>
            <div className="card bg-base-100 w-full max-w-sm shadow-xl">
                <div className="card-body">{children}</div>
            </div>
            <Toaster />
        </div>
    );
}
