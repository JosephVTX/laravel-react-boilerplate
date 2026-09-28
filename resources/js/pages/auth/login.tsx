import { Head, Link, useForm } from '@inertiajs/react';
import { FieldInput } from '@/components/crud/FieldInput';
import { simpleField } from '@/components/crud/simple-field';
import { register } from '@/routes';
import { store as loginStore } from '@/routes/login';

const emailField = simpleField('email', 'Correo', 'email');
const passwordField = simpleField('password', 'Contrasena', 'password');

export default function Login({ canRegister }: { canRegister: boolean }) {
    // El tipo del formulario ES el DTO de PHP (App\Data\Auth\LoginData).
    const form = useForm<App.Data.Auth.LoginData>({ email: '', password: '', remember: false });

    return (
        <>
            <Head title="Iniciar sesion" />
            <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post(loginStore.url(), { onFinish: () => form.reset('password') });
                }}
            >
                <FieldInput
                    field={emailField}
                    value={form.data.email}
                    error={form.errors.email}
                    onChange={(v) => form.setData('email', String(v))}
                />
                <FieldInput
                    field={passwordField}
                    value={form.data.password}
                    error={form.errors.password}
                    onChange={(v) => form.setData('password', String(v))}
                />
                <label className="label cursor-pointer justify-start gap-2">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={form.data.remember}
                        onChange={(e) => form.setData('remember', e.target.checked)}
                    />
                    Recordarme
                </label>
                <button type="submit" className="btn btn-primary" disabled={form.processing}>
                    {form.processing ? <span className="loading loading-spinner loading-sm" /> : null}
                    Entrar
                </button>
                {canRegister ? (
                    <Link href={register.url()} className="link text-center text-sm">
                        Crear una cuenta
                    </Link>
                ) : null}
            </form>
        </>
    );
}
