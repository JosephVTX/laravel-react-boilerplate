<?php

namespace App\Http\Controllers\Auth;

use App\Data\Auth\LoginData;
use App\Data\Auth\RegisterData;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('auth/login', ['canRegister' => (bool) config('app.allow_registration')]);
    }

    public function login(LoginData $data, Request $request): RedirectResponse
    {
        if (! Auth::attempt(['email' => $data->email, 'password' => $data->password], $data->remember)) {
            return back()->withErrors(['email' => 'Credenciales incorrectas.'])->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended('/');
    }

    public function showRegister(): Response
    {
        abort_unless(config('app.allow_registration'), 404);

        return Inertia::render('auth/register');
    }

    public function register(RegisterData $data, Request $request): RedirectResponse
    {
        abort_unless(config('app.allow_registration'), 404);

        $user = User::create(['name' => $data->name, 'email' => $data->email, 'password' => $data->password]);
        $user->assignRole('user');

        Auth::login($user);
        $request->session()->regenerate();

        return redirect('/');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
