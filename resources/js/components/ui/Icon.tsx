import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronsUpDown,
    CircleAlert,
    CircleCheck,
    Folder,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Pencil,
    Plus,
    Search,
    Shield,
    Sun,
    Trash2,
    Users,
    X,
    type LucideIcon,
} from 'lucide-react';

/**
 * Registro de iconos (solo los listados entran al bundle). Para un icono nuevo: importarlo y agregarlo aqui;
 * asi el backend puede referenciarlo por nombre (CrudDefinition::icon / NavItemData::icon).
 */
const icons = {
    'chevron-down': ChevronDown,
    'chevron-left': ChevronLeft,
    'chevron-right': ChevronRight,
    'chevron-up': ChevronUp,
    'chevrons-up-down': ChevronsUpDown,
    'circle-alert': CircleAlert,
    'circle-check': CircleCheck,
    folder: Folder,
    dashboard: LayoutDashboard,
    'log-out': LogOut,
    menu: Menu,
    moon: Moon,
    pencil: Pencil,
    plus: Plus,
    search: Search,
    shield: Shield,
    sun: Sun,
    trash: Trash2,
    users: Users,
    x: X,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export function Icon({ name, className = 'size-5' }: { name: string; className?: string }) {
    const Component: LucideIcon = icons[name as IconName] ?? Folder;

    return <Component className={className} aria-hidden="true" />;
}
