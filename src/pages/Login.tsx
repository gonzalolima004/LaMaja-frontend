import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login: React.FC = () => {
    const [email, setEmail] = React.useState<string>('');
    const [contrasena, setContrasena] = React.useState<string>('');
    const [error, setError] = React.useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); 

        try {
            const response = await api.post('/usuarios/login', {
                email,
                contrasena,
            });

            const { token, usuario } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("usuario", JSON.stringify(usuario));

            navigate('/admin/home');

        } catch (err: any) {
            console.error('Error al iniciar sesión:', err);
            setError(err.response?.data?.mensaje || 'Error al iniciar sesión. Inténtalo de nuevo.');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Iniciar Sesión</h2>

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />

            <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Contraseña"
                required
            />

            <button type="submit">Entrar</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default Login;
