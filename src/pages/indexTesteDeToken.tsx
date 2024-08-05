import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Pesquisador from '@/components/Etapa1ConsultaCaptura';
import Login from '@/components/Etapa3Login';

const HomePage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Ao montar o componente, verifica se há um token salvo no localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const receiveToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken); // Salva o token no localStorage ao fazer login
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token'); // Remove o token do localStorage ao fazer logout
  };

  return (
    <>
      <Head>
        <title>Página Inicial</title>
        <meta name="description" content="Sua descrição aqui" />
      </Head>

      <main className='mt-10 my-4 justify-center items-center flex flex-1 w-full'>
        <div>
          <Pesquisador />
        </div>

        <div>
          {!token ? (
            <Login receiveToken={receiveToken} />
          ) : (
            <>
              <p>Ola token gerado: {token}</p>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-4">
                Logout
              </button>
              {/* Passa token e placaForConsulta para o componente de consulta */}
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default HomePage;
