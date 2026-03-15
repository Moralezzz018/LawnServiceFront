import { FormEvent, useState } from 'react';
import { Leaf, LockKeyhole } from 'lucide-react';

type AdminLoginProps = {
  onLoginSuccess: (token: string) => void;
};

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload?.data?.token) {
        throw new Error(payload?.message || 'Credenciales inválidas');
      }

      onLoginSuccess(payload.data.token);
    } catch (submitError) {
      setError('Credenciales inválidas. Verifica correo y contraseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAF4] text-[#1E1E1E]">
      <div className="mx-auto flex min-h-screen max-w-[1440px] items-center justify-center px-6 py-10 lg:px-12">
        <div className="w-full max-w-md rounded-2xl border border-[#D9E8C5] bg-white p-6 shadow-md lg:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#D9E8C5] text-[#3B4A10]">
              <Leaf className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Acceso de administrador</h1>
            <p className="mt-1 text-sm text-[#1E1E1E]/60">Ingresa para gestionar precios y cotizaciones.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm text-[#1E1E1E]/75">Correo</span>
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                placeholder="owner@email.com"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-[#1E1E1E]/75">Contraseña</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                placeholder="••••••••"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#6B7C2E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3B4A10] disabled:opacity-60"
            >
              <LockKeyhole className="h-4 w-4" />
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
