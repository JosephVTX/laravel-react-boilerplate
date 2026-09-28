import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import GuestLayout from '@/components/layout/GuestLayout';

// Cada pagina se carga bajo demanda (code-splitting): menos JS inicial en servidores/redes lentas.
const pages = import.meta.glob<{ default: ResolvedComponent }>('./pages/**/*.tsx');

const guestPages = new Set(['error']);
const appName: string = import.meta.env.VITE_APP_NAME ?? 'App';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        const loader = pages[`./pages/${name}.tsx`];
        if (!loader) throw new Error(`Pagina Inertia no encontrada: ${name}`);

        const module = await loader();
        // Layout persistente por defecto (la pagina puede definir el suyo con `Page.layout`).
        module.default.layout ??= name.startsWith('auth/') || guestPages.has(name) ? GuestLayout : AppLayout;

        return module.default;
    },
    progress: { color: '#570df8' },
});
