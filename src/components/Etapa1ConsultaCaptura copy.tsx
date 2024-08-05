import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Modal from 'react-modal';
import BottomWhatsApp from "./BottomWhatsApp";

interface VehicleData {
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
  chassi: string;
  municipio: string;
  uf: string;
  segmento: string;
  anoModelo: string;
  subsegmento: string;
  combustivel: string;
  cilindradas: string;
  placa: string;
}



Modal.setAppElement('#__next'); // Necessário para acessibilidade

const Etapa1ConsultaCaptura = () => {

  const [placa, setPlaca] = useState("");
  const [token, setToken] = useState(process.env.NEXT_PUBLIC_TOKEN as string);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [time, setTime] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [unlockTime, setUnlockTime] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar o modal
  const [iframeUrl, setIframeUrl] = useState(""); // Estado para armazenar a URL do iframe



  const router = useRouter();

  const handlePlacaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlaca(event.target.value);
  };

  const generateIdempotencyKey = (placa: string) => {
    const timestamp = new Date().toISOString();
    return `${placa}-${timestamp}`;
  };

  const handleSubmit = async () => {
    const idempotencyKey = generateIdempotencyKey(placa);

    try {
      const response = await axios.post(
        "/api/getplaca",
        {
          placa,
          token,
          idempotencyKey,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Idempotency-Key": idempotencyKey,
          },
        }
      );

      const data = response.data;
      if (data.codigo === 1) {
        setVehicleData(data.informacoes_veiculo);
        setErrorMsg("");
      } else {
        setVehicleData(null);
        setErrorMsg(data.msg);
      }
    } catch (error) {
      setVehicleData(null);
      setErrorMsg("Ocorreu um erro na solicitação.");
    }
  };

  const handleClick = () => {
    setClicked(true);
    setButtonDisabled(true);
    setUnlockTime(Date.now() + 40000);
  };

  const handleBoth = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit();
    handleClick();
  };

  useEffect(() => {
    const storedData = localStorage.getItem('timerData');
    if (storedData) {
      const { timeLeft, unlockTime } = JSON.parse(storedData);
      setTime(timeLeft);
      setButtonDisabled(true);
      setUnlockTime(unlockTime);
    }
  }, []);

  useEffect(() => {
    let intervalId: any = null;

    if (clicked && !buttonDisabled) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    }

    return () => clearInterval(intervalId);
  }, [clicked, buttonDisabled]);

  useEffect(() => {
    if (buttonDisabled) {
      const intervalId = setInterval(() => {
        const timeLeft = Math.round((unlockTime - Date.now()) / 1000);
        if (timeLeft <= 0) {
          setButtonDisabled(false);
          setUnlockTime(0);
          clearInterval(intervalId);
          localStorage.removeItem('timerData');
        } else {
          setTime(timeLeft * 1000);
          const data = { timeLeft: timeLeft * 1000, unlockTime };
          localStorage.setItem('timerData', JSON.stringify(data));
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [buttonDisabled, unlockTime]);

  useEffect(() => {
    if (unlockTime) {
      const interval = setInterval(() => {
        if (Date.now() >= unlockTime) {
          setButtonDisabled(false);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [unlockTime]);

  const generateRandomTag = () => {
    const randomString = Math.random().toString(36).substring(7);
    return randomString;
  };

  const encryptPlaca = (placa: string) => {
    return btoa(placa);
  };

  const handleRedirect = () => {
    const idempotencyKey = generateIdempotencyKey(placa);
    const randomTag = generateRandomTag();
    const encryptedPlaca = encryptPlaca(placa);

    const url = `/productPage?key=${idempotencyKey}&tag=${randomTag}&placa=${encodeURIComponent(encryptedPlaca)}`;

    router.push(url);
  };

  const handleOpenModal = () => {
    const idempotencyKey = generateIdempotencyKey(placa);
    const randomTag = generateRandomTag();
    const encryptedPlaca = encryptPlaca(placa);

    const url = `/productPage?key=${idempotencyKey}&tag=${randomTag}&placa=${encodeURIComponent(encryptedPlaca)}`;

    setIframeUrl(url);
    setModalIsOpen(true);
  };

  return (
    <div className="flex">
      <div className='justify-center w-full'>
        <h1 className='text-xl text-center py-3 font-semibold text-gray-700'>Digite aqui a sua placa:</h1>
        <form onSubmit={handleBoth}>
          <div className='justify-center py-4 flex'>
            <input
              className="min-w-[200px] max-w-[240px] max-h-[64px] shadow px-3 py-3 text-4xl placeholder-shown:text-center placeholder-shown:justify-center placeholder-zinc-400 text-gray-800 bg-white rounded-md border border-gray-400 focus:ring-blue-900 focus:ring-1 focus:outline-none resize-none scrollbar scrollbar-thumb-gray-700 scroolbar-track-transparent scrollbar-thin"
              placeholder="AAA-1234"
              type="text"
              id="placa"
              value={placa}
              onChange={handlePlacaChange}
              maxLength={7}
              minLength={6}
            />
          </div>
          <div className='flex justify-center py-2'>
            <button
              disabled={buttonDisabled}
              className="min-w-[240px] max-w-[380px] shadow flex justify-center py-3 border border-transparent text-lg font-semibold rounded-md text-white bg-green-800 hover:bg-blue-900"
            >
              {buttonDisabled
                ? `Botão bloqueado. Espere ${Math.round(
                  (unlockTime - Date.now()) / 1000
                )} segundos`
                : 'Consultar Placa'}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className='col-span-1'>
            <div className='p-3 text-center'>
              <p className='font-medium'></p>
              <p>
                <br />Não conseguiu todas as informações?
                <br />Nos Chame agora no Whatsapp!
              </p>
            </div>
            <div className='text-center pt-2'>
              <button className="m-2">
                <a href="https://api.whatsapp.com/send?phone=5599984633422&text=OI.%20Tudo%20bom%3F%20Gostaria%20de%20buscar%20informa%C3%B5es%20sobre%20o%20meu%20ve%C3%ADculo%20atrav%C3%A9s%20da%20placa%20e%20Chassi."
                  className="w-60 h-12 shadow flex justify-center items-center border border-transparent text-sm font-semibold rounded-md text-white bg-yellow-400 hover:bg-yellow-500 animate-bounce"
                >
                  👑 Liberar todas as Informações
                </a>
              </button>
            </div>
          </div>
        )}

        {vehicleData && (
          <div className="flex items-center justify-center">
            <div className="items-center justify-center">
              <h2 className="ml-6 mt-8 mb-4 text-2xl font-semibold text-center text-blue-900">Resultado da consulta:</h2>

              <div className="flex">
                <p className="w-full p-2 pr-20 xl-2 bg-gray-100 border border-gray-400 font-medium"> Placa: </p>
                <p className="w-full p-2 pr-20 xl-2 bg-gray-50 border border-gray-400 font-normal"> {vehicleData.placa} </p>
              </div>

              <div className="flex">
                <div className="w-full p-2 pr-10 xl-2 bg-gray-100  border-gray-400 border font-medium justify-center items-center content-center"> Renavam</div>
                <div className=' bg-gray-50  border-gray-400 border '>
                  <button onClick={handleOpenModal} className="min-w-[150px]  mr-4 ml-4 m-2 mt-4 shadow  min-h-[36px] flex justify-center items-center text-xs rounded-md text-white bg-yellow-400 hover:bg-yellow-500 animate-bounce">
                    👑 Liberar Informações
                  </button>
                </div>
              </div>

              <div className="flex">
                <p className="w-full p-2 pr-20 xl-2 bg-gray-100 border border-gray-400 font-medium"> Marca: </p>
                <p className="w-full p-2 pr-20 xl-2 bg-gray-50 border border-gray-400 font-normal"> {vehicleData.marca} </p>
              </div>
              <div className="flex">
                <p className="w-full p-2 pr-20 xl-2 bg-gray-100 border border-gray-400 font-medium"> Modelo: </p>
                <p className="w-full p-2 pr-20 xl-2 bg-gray-50 border border-gray-400 font-normal"> {vehicleData.modelo} </p>
              </div>
              <div className="flex">
                <div className="w-full p-2 pr-10 xl-2 bg-gray-100  border-gray-400 border font-medium justify-center items-center content-center"> Proprietário</div>
                <div className=' bg-gray-50  border-gray-400 border '>
                  <button onClick={handleOpenModal} className="min-w-[150px]  mr-4 ml-4 m-2 mt-4 shadow  min-h-[36px] flex justify-center items-center text-xs rounded-md text-white bg-yellow-400 hover:bg-yellow-500 animate-bounce">
                    👑 Liberar Informações
                  </button>
                </div>
              </div>
              <div className="flex">
                <p className="w-full p-2 pr-20 xl-2 bg-gray-100 border border-gray-400 font-medium"> Ano: </p>
                <p className="w-full p-2 pr-20 xl-2 bg-gray-50 border border-gray-400 font-normal"> {vehicleData.ano} </p>
              </div>
              <div className="flex">
                <p className="w-full p-2 pr-20 xl-2 bg-gray-100 border border-gray-400 font-medium"> Cor: </p>
                <p className="w-full p-2 pr-20 xl-2 bg-gray-50 border border-gray-400 font-normal"> {vehicleData.cor} </p>
              </div>
              <div className="flex">
                <p className="w-full p-2 pr-20 xl-2 bg-gray-100 border border-gray-400 font-medium"> Chassi: </p>
                <p className="w-full p-2 pr-20 xl-2 bg-gray-50 border border-gray-400 font-normal"> {vehicleData.chassi} </p>
              </div>
              <div className="flex">
                <div className="w-full p-2 pr-10 xl-2 bg-gray-100  border-gray-400 border font-medium justify-center items-center content-center"> Nº do Proprietário</div>
                <div className=' bg-gray-50  border-gray-400 border '>
                  <button onClick={handleOpenModal} className="min-w-[150px]  mr-4 ml-4 m-2 mt-4 shadow  min-h-[36px] flex justify-center items-center text-xs rounded-md text-white bg-yellow-400 hover:bg-yellow-500 animate-bounce">
                    👑 Liberar Informações
                  </button>
                </div>
              </div>
           
              <div className="flex">
                <p className="w-full p-2 pr-20 xl-2 bg-gray-100 border border-gray-400 font-medium"> Município: </p>
                <p className="w-full p-2 pr-20 xl-2 bg-gray-50 border border-gray-400 font-normal"> {vehicleData.municipio} </p>
              </div>
              <div className="flex">
                <p className="w-full p-2 pr-20 xl-2 bg-gray-100 border border-gray-400 font-medium"> UF: </p>
                <p className="w-full p-2 pr-20 xl-2 bg-gray-50 border border-gray-400 font-normal"> {vehicleData.uf} </p>
              </div>
              <div className="flex">
                <p className="w-full p-2 pr-20 xl-2 bg-gray-100 border border-gray-400 font-medium"> Segmento: </p>
                <p className="w-full p-2 pr-20 xl-2 bg-gray-50 border border-gray-400 font-normal"> {vehicleData.segmento} </p>
              </div>
              <div className="flex">
                <div className="w-full p-2 pr-10 xl-2 bg-gray-100  border-gray-400 border font-medium justify-center items-center content-center"> Endereço Veículo:</div>
                <div className=' bg-gray-50  border-gray-400 border '>
                  <button onClick={handleOpenModal} className="min-w-[150px]  mr-4 ml-4 m-2 mt-4 shadow  min-h-[36px] flex justify-center items-center text-xs rounded-md text-white bg-yellow-400 hover:bg-yellow-500 animate-bounce">
                    👑 Liberar Informações
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Informações adicionais"
          className="fixed inset-0 flex items-center justify-center bg-zinc-800 bg-opacity-0"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg p-1 w-[1720px]  h-[780px] md:h-[860px] ">
            <div className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setModalIsOpen(false)}></div>
            <iframe src={iframeUrl} className="w-full h-full" />
          </div>
          <div className="-ml-20 m-5 h-full content-end mb-14 cursor-pointer ">
            <BottomWhatsApp />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Etapa1ConsultaCaptura;
