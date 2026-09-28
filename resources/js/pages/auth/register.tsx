import { Head, Link, useForm } from '@inertiajs/react';
import { FieldInput } from '@/components/crud/FieldInput';
import { simpleField } from '@/components/crud/simple-field';
import { login } from '@/routes';
import { store as registerStore } from '@/routes/register';

type RegisterForm = App.Data.Auth.RegisterData;

const fields: { key: keyof RegisterForm; field: App.Data.Crud.FieldData }[] = [
    { key: 'name', field: simpleField('name', 'Nombre') },
    { key: 'email', field: simpleField('email', 'Correo', 'email') },
    { key: 'password', field: simpleField('password', 'Contrasena', 'password') },
    {
        key: 'password_confirmation',
        field: simpleField('password_confirmation', 'Repetir contrasena', 'password'),
    },
];

export default function Register() {
    const form = useForm<RegisterForm>({ name: '', email: '', password: '', password_confirmation: '' });

    return (
        <>
            <Head title="Crear cuenta" />
            <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post(registerStore.url());
                }}
            >
                {fields.map(({ key, field }) => (
                    <FieldInput
                        key={key}
                        field={field}
                        value={form.data[key]}
                        error={form.errors[key]}
                        onChange={(v) => form.setData(key, String(v))}
                    />
                ))}
                <button type="submit" className="btn btn-primary" disabled={form.processing}>
                    Registrarme
                </button>
                <Link href={login.url()} className="link text-center text-sm">
                    Ya tengo cuenta
                </Link>
            </form>
        </>
    );
}
