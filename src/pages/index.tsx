import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Imagem } from '@/components/Imagem';
import BottomWhatsApp from '@/components/BottomWhatsApp';
import Duvidas from '@/components/Duvidas';
import { Rodape } from '@/components/Rodape';
import Faq from '@/components/Faq';
import Header from '@/components/Header';
import Etapa1ConsultaCaptura from '@/components/Etapa1ConsultaCaptura';


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
                <meta name="description" content="Consultar Placa de Veiculo
                                          como achar o dono do veiculo pela placa
                                          consulta placa proprietário
                                          Consulta Placa
                                          Descobrir Veiculo pela Placa
                                          como achar alguem pela placa
                                          como achar uma pessoa pela placa do veículo
                                          como descobrir dono de carro
                                          como descobrir o dono do veiculo pela placa
                                          como encontrar dono de veiculo pela placa
                                          como puxar o endereço pela placa do veículo,
                                          Pesquisar placa no Detran
                                          Puxar placa de moto
                                          Puxar emplacamento
                                          Aplicativo de consulta de placa
                                          Verificar placa
                                          Como descobrir endereço com a placa do veículo
                                          Olhar emplacamento da moto
                                          Pesquisar documento do carro
                                          Puxar placa Detran
                                          Consultar carro no Detran
                                          Achar endereço pela placa
                                          Check placa
                                          Como consultar placa de moto
                                          Como pesquisar a placa de um veículo
                                          Como puxar documentos de veículos
                                          Como saber se a moto é roubada pela placa
                                          Consulta de placa
                                          Consulta multas veículo
                                          Consultar multas pela placa
                                          Consultar placa de moto
                                          Consultar placa de veículo
                                          Consultar placa do Detran
                                          Consultar placa pelo Detran
                                          Consultar placa veículo
                                          Detran consulta
                                          Detran consulta completa
                                          Detran consulta placa
                                          Detran para consulta por placa
                                          Fipe pela placa
                                          Pesquisar documento da moto
                                          Pesquisar documento de veículos
                                          Pesquisar moto pela placa
                                          Pesquisar placa de veículo
                                          Placa de carro
                                          Puxar a placa
                                          Puxar carro
                                          Puxar ano pela placa
                                          Puxar o documento do carro
                                          Puxar placa de moto Detran
                                          Puxar placa de uma moto
                                          Saber o nome do proprietário pela placa
                                          Tem como saber o nome do proprietário pela placa grátis
                                          Ver documento de moto
                                          Verificar documentação de moto 
                                          
                                            No BuscarDados, somos o seu guia confiável para todas as suas necessidades de consulta de placa de veículo e informações detalhadas sobre automóveis. Com palavras-chave como pesquisar placa no Detran e puxar placa de moto, nossa plataforma é a ferramenta ideal para desvendar rapidamente os segredos de qualquer carro.

                                            Precisa verificar a situação cadastral de um veículo? Procurando um aplicativo ágil e eficiente para consulta de placa? Aqui no BuscarDados, oferecemos uma experiência simples e direta para verificar placa e acessar dados essenciais sobre qualquer automóvel.

                                            Descubra como descobrir endereço com a placa do veículo e obtenha informações sobre o proprietário. Garanta a procedência antes de adquirir um carro usado com nossa plataforma que permite achar endereço pela placa e realizar consultas completas para uma compra segura.

                                            Com apenas alguns cliques, você pode facilmente puxar emplacamento e pesquisar documento do carro em nossa base de dados atualizada e confiável.

                                            Não deixe de realizar a consulta placa Detran e consultar carro no Detran para obter informações precisas sobre multas e situação cadastral.

                                            Fique tranquilo ao puxar placa de moto Detran e verificar se a moto é roubada pela placa. Proteja-se contra fraudes e surpresas desagradáveis.

                                            Em nosso site, você encontrará tudo isso e muito mais. Faça agora mesmo uma consulta de placa e descubra todas as informações essenciais sobre veículos com rapidez e segurança.

                                            Aproveite também a consulta multas veículo e mantenha-se informado sobre as infrações do automóvel que deseja adquirir.

                                            Seja para puxar placa de uma moto ou verificar documentação de moto, o BuscarDados é o seu guia completo para informações sobre veículos.

                                            Nossa plataforma também oferece consulta placa de moto e consulta placa de veículo diretamente pelo Detran, garantindo dados precisos e atualizados.

                                            Descubra como consultar placa de moto ou como pesquisar a placa de um veículo e esteja sempre informado sobre o automóvel de interesse.

                                            No BuscarDados, você nunca estará no escuro sobre um veículo. Confiabilidade, segurança e agilidade são nossas prioridades para proporcionar a melhor experiência em consulta de placa e informações veiculares.

                                            Aproveite nossos serviços e tenha acesso a um mundo de dados automotivos ao alcance das suas mãos. O BuscarDados é o seu aliado para consulta de placa de veículo e muito mais!
                                                                                    "
                    />     
            </Head>
      
      <Header />

      <main className="justify-center items-center">
                <span className="">
                    <Etapa1ConsultaCaptura />
                </span>

                <span className=" ">
                    <h1 className="py-8  text-center font-black text-5xl text-blue-900">
                        Vai comprar um veículo?
                    </h1>

                    <h2 className="text-center justify-center text-xl mb-8">
                        Saber seu histórico nunca foi tão fácil! <br />
                        Por <strong>apenas</strong> <strong className="text-blue-900">R$ 8,99</strong> consulte pela placa <br /> e receba diversas informações. 😉
                    </h2>
                </span>
            </main>
      <div className=''>
      <Imagem />
      </div>

      <div className=''>
      <Duvidas />
      </div>

      <Faq />

      <div className='flex-auto BottomStyle fixed bottom-3 right-1  h-15 w-16 cursor-pointer'>
        <BottomWhatsApp />
      </div>
      <div >
        <Rodape />
      </div>
    </>
  );
}

export default HomePage;
