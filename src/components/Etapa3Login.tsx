import React, { useState } from 'react';

interface LoginData {
  success: boolean;
  message: string;
  token: string;
}

const Etapa3Login = ({ receiveToken }: { receiveToken: (token: string) => void }) => {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => { 
    try {
      const response = await fetch('https://bancariosaprova.com.br/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data: LoginData = await response.json();

      if (data.success) {
        receiveToken(data.token); // Envia o token para o componente pai
      } else {
        setError('Falha na autenticação: ' + data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError('Erro ao processar a solicitação: ' + error.message);
      } else {
        setError('Erro desconhecido ao processar a solicitação');
      }
    }
  };

  return (
    <div>     
      <div className='justify-center items-center'>
        <div className='mt-10 text-center text-3xl px-2'>
          Recebemos o seu pagamento com Sucesso! 💲  💵  💲💰
          <p className='text-sm my-12 px-2'>
            Agora, você está a <strong>dois cliques</strong> de liberar a sua consulta com sua consulta
          </p>
          <p className='text-sm md:my-12 my-9 px-2'>
            Clique aqui para autenticar os dados da consulta
          </p>
          <p className='my-6 text-gray-500 opacity-90'> <strong>Clique aqui 👇👇</strong></p>
        </div>
      </div>

      <div className='flex w-full justify-center items-center'>
        <button
          className='md:my-16 md:mb-24 my-8 h-16 md:w-96 px-4 flex justify-center text-zinc-100 items-center text-lg font-semibold hover:bg-green-800 rounded-lg bg-blue-900 animate-bounce'
          onClick={handleLogin}
        >
          Clique aqui para liberar a consulta
        </button>
      </div>

      {error && (
        <div>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Etapa3Login;
