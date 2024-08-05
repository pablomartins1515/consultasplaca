import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { Rodape } from '@/components/Rodape';
import PlacaMold from '@/components/PlacaMold';
import Etapa3Login from '@/components/Etapa3Login';
import Etapa4ConsultaVeicular from '@/components/Etapa4ConsultaVeicular';


interface Etapa2ProductPageProps {
  placa: string;
  idempotencyKey: string;
}

interface Payer {
  email: string;
  name: string;
  cpf: string;
}

interface PaymentData {
  id: string;
  point_of_interaction: {
    transaction_data: {
      qr_code_base64: string;
      qr_code: string;
    };
  };
}

// Função de descriptografia básica (exemplo)
const decryptPlaca = (encryptedPlaca: string) => {
  // Implemente sua lógica de descriptografia aqui
  return atob(encryptedPlaca); // Exemplo simples usando base64 para descriptografia
};

const Etapa2ProductPage: React.FC<Etapa2ProductPageProps> = ({ placa, idempotencyKey }) => {
  const router = useRouter();
  const { key, tag, placa: encryptedPlaca } = router.query;
  const [quantity, setQuantity] = useState(1);
  const [payer, setPayer] = useState<Payer>({ email: '', name: '', cpf: '' });
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [placaForConsulta, setPlacaForConsulta] = useState<string>('');
  const [showForm, setShowForm] = useState(true);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1); // Estado para controlar a etapa atual

  // Descriptografa a placa recebida na query string
  const decryptedPlaca = decryptPlaca(decodeURIComponent(encryptedPlaca as string || ''));

  // Agora você pode usar a variável 'placa' normalmente

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleTokenReceive = (token: string) => {
    setToken(token);
    setStep(4); // Vai para a etapa de consulta veicular
  };


  const createPayment = async () => {
    try {
      const response = await axios.post('https://bancariosaprova.com.br/makePayment', { quantity, payer, key });
      setPaymentData(response.data);
      setPaymentStatus('pending');
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao fazer pagamento:', error);
      setErrorMessage('Por favor, preencha todos os dados corretamente!');
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    try {
      const response = await axios.get(`https://bancariosaprova.com.br/checkPaymentStatus/${paymentId}`);
      setPaymentStatus(response.data.status);
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      setErrorMessage('Erro ao verificar status do pagamento');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (paymentData && paymentStatus === 'pending') {
      interval = setInterval(() => {
        checkPaymentStatus(paymentData.id);
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [paymentData, paymentStatus]);

  useEffect(() => {
    if (paymentStatus === 'approved') {
      if (placa) {
        setPlacaForConsulta(decryptedPlaca as string);
      }
      setStep(3); // Muda para a etapa de login após a aprovação do pagamento
    }
  }, [paymentStatus, placa]);

  const handleCopy = () => {
    if (paymentData) {
      navigator.clipboard.writeText(paymentData.point_of_interaction.transaction_data.qr_code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };


  return (
    <div className="max-w-full mx-auto">
      <Header />
      <div className={`${paymentStatus === 'approved' ? 'bg-green-800 bg-opacity-50' : 'bg-orange-200'}`}>
        <h2 className="pt-2 md:text-2xl text-base px-2 flex text-center content-center items-center pb-2 justify-center mt-4 text-gray-500 ">
          <p className='bold font-extrabold   '>LIBERAR TODOS </p>
          <p className='opacity-0'>-</p>
          os dados da Placa
          <div className='px-3'>
            <div className="flex flex-col justify-center text-center content-center items-center bg-red-100">
              <div className="">
                <div className="relative ">
                  <div className=" md:mb-10 mt-3 flex md:mt-0 absolute inset-1 items-center justify-center z-10">
                    <span className="text-2xl font-extrabold justify-center text-center content-center text-black flex print:mt-0  ">{decryptedPlaca}</span>
                  </div >
                  <PlacaMold />   
                </div>
              </div>
            </div>
          </div>
        </h2>
      </div>
      {step === 1 && (
        <>
          {showForm && (
            <div>

              <h2 className=" content-center items-center md:mt-0 mt-2  text-2xl flex text-center justify-center p-1 text-gray-500 "> Por apenas <span className='opacity-0'>-</span> <strong className='text-blue-900'> R$ 8,99 </strong> </h2>
              <h2 className=" md:text-2xl text-xl md:mt-0 mt-2  font-bold flex text-center justify-center mb-8 text-gray-500 "
              > Através do PAGAMENTO via <p className='opacity-0'>-</p><p className='text-white bg-gray-600 px-2 rounded-sm'>
                  PIX
                </p>
              </h2>
            </div>
          )}

          {showForm && (
            <div className='flex flex-1 justify-center bg-zinc-100'>
              <h1 className="md:text-base text-xs flex text-center items-center justify-center bg-zinc-100 p-4 md:w-[760px] md:px-10 text-zinc-600 ">
                <p className=''><strong>Nota:</strong> Para a sua segurança, pedimos o envio o e-mail e seu CPF através deste formulário.  Obedecendo assim toda a LGPD e garantia a proteção dos dados e Direito a Reembolso do valor caso os dados da placa <strong>{placa} </strong>não sejam gerados em tela.</p>
              </h1>
            </div>

          )}

          {showForm && (
            <div className='bg-zinc-50 items-center justify-center w-full flex'>
              <div className="">

                <div className='items-center max-w-[700px] justify-center content-center w-96 pb-5 pr-5 pl-5 '>
                  <div className="mb-6 mt-3">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Seu e-mail</label>
                    <input
                      type="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="nome@dominio.com"
                      required
                      value={payer.email}
                      onChange={(e) => setPayer({ ...payer, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900">Seu Nome</label>
                    <input
                      type="text"
                      id="nome"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Nome completo"
                      required
                      value={payer.name}
                      onChange={(e) => setPayer({ ...payer, name: e.target.value })}
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="cpf" className="block mb-2 text-sm font-medium text-gray-900">
                      Seu CPF
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="CPF"
                      required
                      value={payer.cpf}
                      onChange={(e) => setPayer({ ...payer, cpf: e.target.value })}
                    />
                  </div>

                  <div className='justify-center flex flex-1 mt-8'>
                    <button
                      className=" text-white min-w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                      onClick={createPayment}
                    >
                      Fazer pagamento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentData && (
            <div className="items-center justify-center flex mx-auto">

              <div className="">
                <h2 className="pt-2 text-2xl font-bold mb-8 text-center text-orange-300 opacity-85">Código QR CODE gerado!</h2>

                <div className='flex flex-col col-span-1 md:flex-row md:row-span-1  items-center justify-center  gap-4 md:gap-24'>
                  <div className='max-w-md '>
                    <div className=' inline-flex gap-1'>   <p className="text-gray-700 font-bold mb-2">Use o código Pix:</p>
                      <p className='text-md text-gray-300 opacity-80'>(copia e cola)</p> </div>

                    <div className="justify-center flex md:justify-start md:block mt-2">
                      <div className='md:visible md:static  static text-xs md:text-base  '>
                        <p className={`ring-gray-100 ring-1 p-3 hover:ring-1 md:w-[560px]  hover:ring-blue-900 ${!('md' in window.screen) && 'truncate w-80'}`}>
                          {paymentData.point_of_interaction.transaction_data.qr_code}</p>
                      </div>
                    </div>


                    <div className='justify-center md:justify-start flex md:my-2'>
                      <button
                        onClick={handleCopy}
                        className=" w-52 mt-6 bg-red md:mt-3 py-2  px-4 bg-blue-900 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                      >
                        Copiar Código Pix
                      </button>
                      <div>
                      </div>
                    </div>
                    <div className='justify-center md:justify-start flex'>
                      {copied && <p className="text-green-500 mt-2">Copiado com sucesso!</p>}

                    </div>
                  </div>

                  <div className='justify-center flex'>
                    <h2 className="text-xl  md:pl-20 font-bold mb-2 text-center">ou</h2>
                  </div>

                  <div className='max-w-md'>
                    <p className="text-sm font-light mb-2 text-center px-5">Faça agora a leitura com seu banco junto a câmera do seu celular</p>
                    <img
                      src={`data:image/png;base64,${paymentData.point_of_interaction.transaction_data.qr_code_base64}`}
                      alt="QR Code"
                      className="mb-2"
                    />
                  </div>


                </div>
              </div>
            </div>


          )}

          <div>
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          </div>
        </>
      )}

      {step === 3 && <Etapa3Login receiveToken={handleTokenReceive} />}
      {step === 4 && token && <Etapa4ConsultaVeicular placaForConsulta={decryptedPlaca} token={token} />}
      <Rodape />
    </div>
  );
};

export default Etapa2ProductPage;


