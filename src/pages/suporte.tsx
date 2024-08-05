import React from 'react';
import Head from 'next/head';
import BottomWhatsApp from '@/components/BottomWhatsApp';
import { Rodape } from '@/components/Rodape';
import Header from '@/components/Header';

const Suporte = () => {
    // Codifica a mensagem para garantir que esteja corretamente formatada na URL
    const encodedMessage = encodeURIComponent(
        "OI. Tudo bom? Gostaria de buscar informações sobre o meu veículo através da placa e Chassi."
    );
    const whatsappLink = `https://www.google.com.br`;

    const reloadAndRedirect = () => {
        // Recarrega a página
        window.location.reload();

        // Define um pequeno atraso antes de redirecionar para garantir que a página seja recarregada
        setTimeout(() => {
            window.location.href = "/suporte";
        }, 100); // 100ms de atraso
    };

    return (
        <>
            <Head>
                <title>Página Inicial</title>
                <meta name="description" content="Descrição da página" />
            </Head>

            <Header />

            <main className="justify-center items-center flex flex-col col-span-1">
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 className="mt-16 mb-8 text-3xl font-bold text-red-700 text-center">
                        Ocorreu algum erro?
                    </h1>

                    <div className="py-24 text-4xl font-bold text-green-800 text-center justify-center">
                        <p>                                Suporte WhatsApp
                        </p>
                    </div>

                    <h2 className="text-xl font-medium text-center py-10 mb-8 text-gray-600 mx-8">
                        Entre em contato através do icone WhatsApp 
                          <strong> no canto da tela</strong> e fale com o suporte agora mesmo!
                        <p>Resolveremos a sua situação! ↘️ 👇</p>
                    </h2>
                </div>
            </main>

            <div className="flex-auto BottomStyle fixed bottom-3 right-1 h-15 w-16 cursor-pointer">
                <BottomWhatsApp />
            </div>

            <Rodape />
        </>
    );
};

export default Suporte;
