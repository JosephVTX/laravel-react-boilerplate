import { Link, router, usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Toaster } from '@/components/ui/Toaster';
import { logout } from '@/routes';

type Theme = 'light' | 'dark';

function readTheme(): Theme {
    try {
        return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    } catch {
        return 'light';
    }
}

function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        const initial = readTheme();
        document.documentElement.dataset.theme = initial;
        return initial;
    });

    const toggle = () => {
        const next: Theme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.dataset.theme = next;
        try {
            localStorage.setItem('theme', next);
        } catch {
            /* almacenamiento no disponible: el tema solo dura la sesion */
        }
        setTheme(next);
    };

    return { theme, toggle };
}

/** Layout autenticado: sidebar generado desde `navigation` (recursos CRUD permitidos) + topbar. */
export default function AppLayout({ children }: { children: ReactNode }) {
    const { appName, navigation, auth } = usePage().props;
    const { url } = usePage();
    const { theme, toggle } = useTheme();

    const links = [{ label: 'Inicio', href: '/', icon: 'dashboard' }, ...navigation];
    const isActive = (href: string) => (href === '/' ? url === '/' : url.startsWith(href));

    return (
        <div className="drawer lg:drawer-open">
            <input id="app-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex min-h-screen flex-col">
                <header className="navbar bg-base-100 sticky top-0 z-30 border-b border-base-300 px-4">
                    <div className="flex-none lg:hidden">
                        <label
                            htmlFor="app-drawer"
                            className="btn btn-square btn-ghost"
                            aria-label="Abrir menu"
                        >
                            <Icon name="menu" />
                        </label>
                    </div>
                    <div className="flex-1" />
                    <button
                        type="button"
                        className="btn btn-ghost btn-circle"
                        onClick={toggle}
                        aria-label="Cambiar tema"
                    >
                        <Icon name={theme === 'light' ? 'moon' : 'sun'} />
                    </button>
                    <div className="dropdown dropdown-end">
                        <button type="button" className="btn btn-ghost" aria-haspopup="menu">
                            {auth.user?.name}
                        </button>
                        <ul className="menu dropdown-content bg-base-100 rounded-box z-40 mt-2 w-56 p-2 shadow">
                            <li className="menu-title truncate">{auth.user?.email}</li>
                            <li>
                                <button type="button" onClick={() => router.post(logout.url())}>
                                    <Icon name="log-out" className="size-4" /> Cerrar sesion
                                </button>
                            </li>
                        </ul>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-6">{children}</main>
            </div>

            <div className="drawer-side z-40">
                <label htmlFor="app-drawer" aria-label="Cerrar menu" className="drawer-overlay" />
                <aside className="bg-base-100 flex min-h-full w-64 flex-col border-r border-base-300">
                    <div className="p-4 text-xl font-bold">{appName}</div>
                    <ul className="menu w-full flex-1 gap-1 px-2">
                        {links.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={isActive(item.href) ? 'menu-active' : ''}
                                    prefetch
                                >
                                    <Icon name={item.icon} className="size-4" />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>

            <Toaster />
        </div>
    );
}
