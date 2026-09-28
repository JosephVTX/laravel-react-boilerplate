import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

/** Muestra los mensajes flash de Laravel (`->with('success'|'error', ...)`) como toasts DaisyUI durante 4s. */
export function Toaster() {
    const { flash } = usePage().props;
    const [dismissed, setDismissed] = useState<object | null>(null);

    const visible = dismissed !== flash && Boolean(flash.success || flash.error);

    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => setDismissed(flash), 4000);
        return () => clearTimeout(timer);
    }, [flash, visible]);

    if (!visible) return null;

    return (
        <output className="toast toast-end toast-top z-50">
            {flash.success ? (
                <div className="alert alert-success">
                    <Icon name="circle-check" />
                    <span>{flash.success}</span>
                </div>
            ) : null}
            {flash.error ? (
                <div className="alert alert-error">
                    <Icon name="circle-alert" />
                    <span>{flash.error}</span>
                </div>
            ) : null}
        </output>
    );
}
