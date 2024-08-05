import React, { useState, useRef, useEffect } from 'react';
import { VehicleData } from '../context/types';
import { useVehicleContext } from '../context/VehicleContext';
import BottomWhatsApp from './BottomWhatsApp';

const options = {
  method: 'open',
  resolution: 'normal',
  page: {
    margin: 'medium',
    format: 'letter',
    orientation: 'landscape',
  },
};

interface SuccessResponse {
  success: boolean;
  msg: string;
  dados: VehicleData;
  logQuery: string;
}

interface Props {
  token: string;
  placaForConsulta?: string;
}

const Etapa4ConsultaVeicular: React.FC<Props> = ({ token, placaForConsulta = '', }) => {
  const { vehicleData, setVehicleData } = useVehicleContext();
  const [placa, setPlaca] = useState<string>(placaForConsulta);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [unlockTime, setUnlockTime] = useState(0);
  const [showForm, setShowForm] = useState(true);
  const [step, setStep] = useState(1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!token) {
        setError('Token não fornecido.');
        setLoading(false);
        return;
      }

      const requestBody = { placa };

      const response = await fetch(process.env.NEXT_PUBLIC_API_URL as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(requestBody),
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const data: SuccessResponse = await response.json();

      if (data.success) {
        setVehicleData(data.dados);
        setError('');
        setShowForm(false);  // Hide the form on successful data retrieval
      } else {
        setError('Erro na consulta: ' + data.msg);
      }
    } catch (error) {
      setError('Erro ao processar a solicitação: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    setClicked(true);
    setButtonDisabled(true);
    setUnlockTime(Date.now() + 30000);
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
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }

    return () => clearInterval(intervalId);
  }, [clicked, buttonDisabled]);

  useEffect(() => {
    if (buttonDisabled) {
      const intervalId = setInterval(() => {
        const timeLeft = Math.round((unlockTime - Date.now()) / 1000);
        if (timeLeft <= 0) {
          clearInterval(intervalId);
          localStorage.removeItem('timerData');
          setButtonDisabled(true); // Keeps the button disabled at the last second
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
          setButtonDisabled(true); // Keeps the button disabled at the last second
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [unlockTime]);

  const copyToClipboard = () => {
    if (targetRef.current) {
      const range = document.createRange();
      range.selectNode(targetRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      try {
        document.execCommand('copy');
        alert('Dados copiados para a área de transferência!');
      } catch (err) {
        console.error('Erro ao copiar para a área de transferência:', err);
      }
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <div className='w-full mb-28'>
      {showForm && (
        <form onSubmit={handleBoth}>
          <label htmlFor="placa">Placa:</label><br />
          <input
            type="text"
            id="placa"
            name="placa"
            value={placa}
            readOnly
          /><br /><br />
          <div className='text-center flex justify-center'>
            <div className='flex justify-center flex-col col-span-1 text-2xl gap-8'>
              <p className=''>Parabéns! 👏👏👏👏👏👏👏</p>
              <p className=''>Chegamos na <strong>ÚLTIMA ETAPA</strong>!</p>
              <p className=''>Agora só clicar em <strong>Gerar Consulta Completa</strong></p>

              <div className='flex justify-center mt-6'>
                <button
                  disabled={buttonDisabled}
                  className={`bg-blue-900 m-4 p-2 rounded-md text-2xl w-80 h-20 font-bold text-white ${!buttonDisabled ? 'hover:bg-green-600 animate-bounce' : 'opacity-30'}`}
                  type="submit"
                >
                  {buttonDisabled
                    ? `Gerando sua Consulta... Por favor aguarde! ${Math.round(
                      (unlockTime - Date.now()) / 1000
                    )} segundos`
                    : 'Gerar Consulta Completa'}
                </button>
              </div>
              <div className='flex justify-center'>
                {loading && <p className='pt-2 flex font-medium justify-center content-center text-gray-500 bg-yellow-400 w-56 h-12 rounded-md'>Carregando...</p>}
              </div>
              <div className='flex items-center px-4 mx-10'>
              {error &&<p className='text-red-500 text-sm m-4  '> {error}</p>}

              </div>
              {error && (
                <div className='flex items-center px-20 md:px-36 justify-centercontent-center text-center'>
                  <div className='text-center pt-2 '>
                    <button className="m-2 flex px-2 ">
                      <a href="https://api.whatsapp.com/send?phone=5599984633422&text=OI.%20Tudo%20bom%3F%20Gostaria%20de%20buscar%20informa%C3%B5es%20sobre%20o%20meu%20ve%C3%ADculo%20atrav%C3%A9s%20da%20placa%20e%20Chassi."
                        className="w-96 h-20 text-3xl gap-2 shadow flex justify-center items-center border border-transparent font-semibold rounded-lg text-white bg-green-600 hover:bg-yellow-500 animate-bounce"
                      >
                        Suporte WhatasApp <div className=''><BottomWhatsApp /></div>
                      </a>
                    </button>
                    <div className='pb-3 text-center'>
                      <p className='text-sm text-red-500 '>Aconteceu algum erro na sua consulta<br />Por favor. Contate-nos agora no Whatsapp! </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      )}

      <div id="content-id" ref={targetRef}>
        {vehicleData && (
          <div className=" pb-16 sm:px-20 bg-white flex flex-col col-span-1">
            <h2 className="text-2xl font-bold mb-4 justify-center flex p-8"></h2>


            {step === 1 && (

              <div>
                <div className='text-2xl px-4 pt-10 font-bold mb-4'>

                  <div className=" pb-16 sm:px-20 bg-white flex justify-center items-center content-center gap-20 ">
                    <button onClick={copyToClipboard} className="bg-green-600 text-white px-16 py-4 rounded-md hover:bg-green-700">
                      Copiar Dados
                    </button>
                      <button onClick={() => window.print()} className='px-16 py-4 bg-blue-600 rounded-md text-white hover:bg-blue-800'>
                        Download PDF</button>
                  </div>

                  <div className=''>
                    <h2 className=" h-12 mx-8 my-8 pb-6 text-2xl font-bold mb-4 bg-blue-900 text-gray-50 text-center rounded-md">INFORMAÇÕES DO VEÍCULO</h2>
                    <div className=" m-4 sm:px-8 items-center justify-center text-center sm:gap-10 text-md sm:flex sm:flex-1 sm:justify-between  sm:mx-5">
                      <table className=" mt-4 sm:w-[28rem] bg-blue-600 divide-gray-50 justify-between rounded-lg overflow-hidden shadow-md   ">
                        <tbody className="bg-white divide-y divide-gray-200 text-start w-[32rem] ">
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold ">Placa:</td>
                            <td className="px-10 py-2">{vehicleData.placa}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold ">Renavam:</td>
                            <td className="px-10 py-2">{vehicleData.renavam}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Chassi:</td>
                            <td className="px-10 py-2">{vehicleData.chassi}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Motor:</td>
                            <td className="px-10 py-2">{vehicleData.motor}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">CPF ou CNPJ do Proprietário:</td>
                            <td className="px-10 py-2">{vehicleData.cpf_cnpj_proprietario}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Pronome:</td>
                            <td className="px-10 py-2">{vehicleData.pronome}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold ">Tipo de documento :</td>
                            <td className="px-10 py-2">{vehicleData.tipodocumentoproprietario}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Marca:</td>
                            <td className="px-10 py-2">{vehicleData.marca}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Modelo:</td>
                            <td className="px-10 py-2">{vehicleData.modelo}</td>
                          </tr>
                          <tr className=''>
                            <td className="px-10 py-2 font-bold">Cor:</td>
                            <td className="px-10 py-2">{vehicleData.cor}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold ">Ano de fabricacão:</td>
                            <td className="px-10 py-2">{vehicleData.veianofabr}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Ano Modelo:</td>
                            <td className="px-10 py-2">{vehicleData.veianomodelo}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Municipio:</td>
                            <td className="px-10 py-2">{vehicleData.municipio}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold ">UF / Estado do veículo:</td>
                            <td className="px-10 py-2">{vehicleData.uffaturado}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold ">Tipo:</td>
                            <td className="px-10 py-2">{vehicleData.tipo}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Situacão do veículo:</td>
                            <td className="px-10 py-2">{vehicleData.situacaoveiculo}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Data de licenciamento:</td>
                            <td className="px-10 py-2">{vehicleData.licdata}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold ">Dara de emissão do CRV:</td>
                            <td className="px-10 py-2">{vehicleData.dataemissaocrv}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold ">Tipo de Documento Faturado:</td>
                            <td className="px-10 py-2">{vehicleData.tipodocumentofaturado}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">CPF/CNPJ faturado:</td>
                            <td className="px-10 py-2">{vehicleData.cpfcnpjfaturado}</td>
                          </tr>

                        </tbody>
                      </table>

                      <table className=" mt-4 sm:w-[28rem] bg-blue-600 divide-gray-50 justify-between rounded-lg overflow-hidden shadow-md  ">
                        <tbody className="bg-white divide-y divide-gray-200 text-start w-[32rem] ">

                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Tipo de documento Importadora:</td>
                            <td className="px-10 py-2">{vehicleData.tipodocumentoimportadora}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold ">Tipo de Remarcação do Chassi:</td>
                            <td className="px-10 py-2">{vehicleData.tiporemarcacaochassi}</td>
                          </tr>

                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Carroceria:</td>
                            <td className="px-10 py-2">{vehicleData.carroceria}</td>
                          </tr>

                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Espécie:</td>
                            <td className="px-10 py-2">{vehicleData.especie}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold ">Chave Retorno:</td>
                            <td className="px-10 py-2">{vehicleData.chaveretorno}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Categoria:</td>
                            <td className="px-10 py-2">{vehicleData.veicategoria}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Potência:</td>
                            <td className="px-10 py-2">{vehicleData.potencia}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Combustível:</td>
                            <td className="px-10 py-2">{vehicleData.combustivel}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Cilindrada:</td>
                            <td className="px-10 py-2">{vehicleData.cilindrada}</td>
                          </tr>

                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Capacidade de carga:</td>
                            <td className="px-10 py-2">{vehicleData.capacidadecarga}</td>
                          </tr>
                          <tr className=''>
                            <td className="px-10 py-2 font-bold">Código categoria:</td>
                            <td className="px-10 py-2">{vehicleData.codigocategoria}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Código Marca:</td>
                            <td className="px-10 py-2">{vehicleData.codigomarca}</td>
                          </tr>

                          <tr className="">
                            <td className="px-10 py-2 font-bold">Código tipo:</td>
                            <td className="px-10 py-2">{vehicleData.codigotipo}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Procedência:</td>
                            <td className="px-10 py-2">{vehicleData.veiprocedencia}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Capacidade de Passageiros:</td>
                            <td className="px-10 py-2">{vehicleData.capacidadepassag}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Número caixa cambio:</td>
                            <td className="px-10 py-2">{vehicleData.numero_caixacambio}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Número Carroceria:</td>
                            <td className="px-10 py-2">{vehicleData.numero_carroceria}</td>
                          </tr>

                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Eixo Traseiro Diferencial:</td>
                            <td className="px-10 py-2">{vehicleData.numero_eixotraseirodif}</td>
                          </tr>
                          <tr className=''>
                            <td className="px-10 py-2 font-bold">Terdeiro Eixo:</td>
                            <td className="px-10 py-2">{vehicleData.numero_terceiroeixo}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">CMT:</td>
                            <td className="px-10 py-2">{vehicleData.cmt}</td>
                          </tr>

                          <tr className="">
                            <td className="px-10 py-2 font-bold">Código Tipo:</td>
                            <td className="px-10 py-2">{vehicleData.codigotipo}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">PBT:</td>
                            <td className="px-10 py-2">{vehicleData.pbt}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Eixos:</td>
                            <td className="px-10 py-2">{vehicleData.eixos}</td>
                          </tr>

                        </tbody>
                      </table>
                    </div>

                    <h2 className=" mt-10 text-2xl font-bold h-12 mx-8 my-8 pb-6 mb-12 bg-yellow-400 rounded-md text-gray-50 text-center ">Débitos PRINCIPAIS</h2>
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mx-5">
                      <table className=" w-full  divide-gray-50">
                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Existe Débitos de IPVA?</td>
                            <td className="px-10 py-2">{vehicleData.existedebitodeipva}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Valor IPVA:</td>
                            <td className="px-10 py-2">{vehicleData.debipva}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Exite Débitos de Multas?</td>
                            <td className="px-10 py-2">{vehicleData.existedebitomulta}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Valor Débitos de Multa:</td>
                            <td className="px-10 py-2">{vehicleData.valortotaldebitomulta}</td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td className="px-10 py-2 font-bold">Existe Débitos de Licenciamento?</td>
                            <td className="px-10 py-2">{vehicleData.existedebitodelicenciamento}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Valor do licenciamento:</td>
                            <td className="px-10 py-2">{vehicleData.existedebitodelicenciamentovl}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Existe Débito de DPVAT:</td>
                            <td className="px-10 py-2">{vehicleData.existedebitodedpvat}</td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td className="px-10 py-2 font-bold">Valor DPVAT:</td>
                            <td className="px-10 py-2">{vehicleData.dpvat}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>


                    <h2 className="h-12 mx-8 my-8 pb-6 mb-12  mt-10 text-2xl font-bold  bg-orange-600 rounded-md text-gray-50 text-center ">RESTRIÇÕES PRINCIPAIS</h2>
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mx-5">
                      <table className=" w-full  divide-gray-50">
                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Restrição 01:</td>
                            <td className="px-10 py-2">{vehicleData.outras_restricoes_01}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Restrição 02:</td>
                            <td className="px-10 py-2">{vehicleData.outras_restricoes_02}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Restrição 03:</td>
                            <td className="px-10 py-2">{vehicleData.outras_restricoes_03}</td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td className="px-10 py-2 font-bold">Restrição 04:</td>
                            <td className="px-10 py-2">{vehicleData.outras_restricoes_04}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>


                    <h2 className="h-12 mx-8 my-8 pb-6 mb-12 mt-10 text-2xl font-bold  bg-red-600 rounded-md text-gray-50 text-center ">RESTRICOES ADMINISTRATIVAS E JUDICIAIS</h2>
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mx-5">
                      <table className=" w-full  divide-gray-50">
                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Restrição Tributária:</td>
                            <td className="px-10 py-2">{vehicleData.resadministrativa}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Restrição Judicial: </td>
                            <td className="px-10 py-2">{vehicleData.resjudicial}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Data de Registro DI:</td>
                            <td className="px-10 py-2">{vehicleData.restritributaria}</td>
                          </tr>

                          <tr className="bg-slate-50">
                            <td className="px-10 py-2 font-bold">Restrição Renajud:</td>
                            <td className="px-10 py-2">{vehicleData.resrenajud}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Restrição Ambiental: </td>
                            <td className="px-10 py-2">{vehicleData.resambiental}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Lic. ex.lic:</td>
                            <td className="px-10 py-2">{vehicleData.licexelic}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Comunicação de Venda:</td>
                            <td className="px-10 py-2">{vehicleData.ccomunicacaovenda}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Tipo do Comprador: </td>
                            <td className="px-10 py-2">{vehicleData.tipodoccomprador}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h2 className="h-12 mx-8 my-8 pb-6 mb-12 mt-10 text-2xl font-bold bg-yellow-400 rounded-md text-gray-50 text-center ">Outras RESTRIÇÕES</h2>
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mx-5">
                      <table className=" w-full  divide-gray-50">
                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Restricão de Financiamento:</td>
                            <td className="px-10 py-2">{vehicleData.restricaofinan}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Restrição Nome agente:</td>
                            <td className="px-10 py-2">{vehicleData.restricaonomeagente}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Restrição Arrendatários:</td>
                            <td className="px-10 py-2">{vehicleData.restricaoarrendatario}</td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td className="px-10 py-2 font-bold">Restrição Inclusão:</td>
                            <td className="px-10 py-2">{vehicleData.restricaodatainclusao}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Restrição Número do Contrato:</td>
                            <td className="px-10 py-2">{vehicleData.numerocontratofinanceira}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Restrição Código Agente financeiro:</td>
                            <td className="px-10 py-2">{vehicleData.codigoagentefinanceiro}</td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td className="px-10 py-2 font-bold">Restrição data vigência do Contrato:</td>
                            <td className="px-10 py-2">{vehicleData.datavigenciacontratofinanceira}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>


                    <h2 className="h-12 mx-8 my-8 pb-6 mb-12  mt-10 text-2xl font-bold bg-green-600 rounded-md text-gray-50 text-center ">INFORMAÇÕES TRIBUTÁRIAS</h2>
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mx-5">
                      <table className=" w-full  divide-gray-50">
                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Pronome Anterior:</td>
                            <td className="px-10 py-2">{vehicleData.pronomeanterior}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Restrição CPF/CNPJ Arrendamento:</td>
                            <td className="px-10 py-2">{vehicleData.restricaocpfcnpjarrendatar}</td>
                          </tr>

                          <tr className="">
                            <td className="px-10 py-2 font-bold">Intenção Restrição Financiamento: </td>
                            <td className="px-10 py-2">{vehicleData.intencaorestricaofinan}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Intenção nome Agente</td>
                            <td className="px-10 py-2">{vehicleData.intencaonomeagente}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Intenção nome Financiamento:</td>
                            <td className="px-10 py-2">{vehicleData.intencaonomefinanc}</td>
                          </tr>

                          <tr className="bg-slate-50">
                            <td className="px-10 py-2 font-bold">Intenção CPF/CNPJ Financiamneto:</td>
                            <td className="px-10 py-2">{vehicleData.intencaocpfcnpjfinanc}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Data de Intenção Incusão: </td>
                            <td className="px-10 py-2">{vehicleData.intencaodatainclusao}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Deb. Dersa:</td>
                            <td className="px-10 py-2">{vehicleData.debdersa}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Dab. Der:</td>
                            <td className="px-10 py-2">{vehicleData.debder}</td>
                          </tr>
                        </tbody>

                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Déb. Detran:</td>
                            <td className="px-10 py-2">{vehicleData.debdetran}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Déb. CETESB: </td>
                            <td className="px-10 py-2">{vehicleData.debcetesb}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Débitos Renainf</td>
                            <td className="px-10 py-2">{vehicleData.debrenainf}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Débitos Municipais:</td>
                            <td className="px-10 py-2">{vehicleData.debmunicipais}</td>
                          </tr>

                          <tr className="bg-slate-50">
                            <td className="px-10 py-2 font-bold">Débitos Polrodfed:</td>
                            <td className="px-10 py-2">{vehicleData.debpolrodfed}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Restrição de Furto: </td>
                            <td className="px-10 py-2">{vehicleData.resfurto}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Restrição Guinçho</td>
                            <td className="px-10 py-2">{vehicleData.resguincho}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h2 className="h-12 mx-8 my-8 pb-6 mb-12  mt-10 text-2xl font-bold bg-gray-300 rounded-md text-gray-50 text-center ">OUTRAS INFORMAÇÕES</h2>
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mx-5">
                      <table className=" w-full  divide-gray-50">
                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold"> Comunicado Inclusão :</td>
                            <td className="px-10 py-2">{vehicleData.ccomunicinclusao}</td>
                          </tr>

                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">CPF do Comprador:</td>
                            <td className="px-10 py-2">{vehicleData.cpfcnpjcomprador}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Data da Venda:</td>
                            <td className="px-10 py-2">{vehicleData.datavenda}</td>
                          </tr>

                          <tr className="bg-slate-50">
                            <td className="px-10 py-2 font-bold">Nota Fiscal:</td>
                            <td className="px-10 py-2">{vehicleData.notafiscal}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Protocolo Detran </td>
                            <td className="px-10 py-2">{vehicleData.protocolodetran}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Ano de Inspeção:</td>
                            <td className="px-10 py-2">{vehicleData.inspecaoano}</td>
                          </tr>

                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Inspeção Centro:</td>
                            <td className="px-10 py-2">{vehicleData.inspecaocentro}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Data da Inspeção:</td>
                            <td className="px-10 py-2">{vehicleData.inspecaodata}</td>
                          </tr>

                          <tr className="bg-slate-50">
                            <td className="px-10 py-2 font-bold">Selo de inspeção</td>
                            <td className="px-10 py-2">{vehicleData.inspecaoselo}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Status da Inspeção: </td>
                            <td className="px-10 py-2">{vehicleData.inspecaostatus}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Código Financeira:</td>
                            <td className="px-10 py-2">{vehicleData.codigofinanceira}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Data inclusão troca financeira:</td>
                            <td className="px-10 py-2">{vehicleData.datainclusaointencaotrocafinanceira}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Data limite de restrição Tributária: </td>
                            <td className="px-10 py-2">{vehicleData.datalimiterestricaotributaria}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Tempo de execução:</td>
                            <td className="px-10 py-2">{vehicleData.tempoexecucao}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h2 className="h-12 mx-8 my-8 pb-6 mb-12  mt-10 font-bold bg-gray-300 rounded-md text-gray-50 text-center ">ALERTA E LGPD </h2>
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mx-5">
                      <table className=" w-full  divide-gray-50 text-sm p-10 font-normal">
                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">INFORMAÇÕES IMPORTANTES:</td>
                            <td className="px-10 py-2">ESTAS INFORMAÇÕES SÃO CONFIDENCIAIS E DEVERÃO SER UTILIZADAS, ÚNICA E EXCLUSIVAMENTE, PARA ORIENTAÇÃO DAS
                              TRANSAÇÕES COMERCIAIS DO USUÁRIO , RESPONSABILIZANDO-SE CIVIL E CRIMINALMENTE POR DANOS QUE OCASIONAR A
                              TERCEIROS, QUANDO UTILIZADAS EM DESACORDO COM A LEGISLAÇÃO EM VIGOR. EM CASO DE DÚVIDAS ENTRE EM CONTATO PELO
                              FALE CONOSCO.</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">AVISO:</td>
                            <td className="px-10 py-2">AINDA QUE EMPREGANDO OS MELHORES ESFORCOS, NOSSA EMPRESA SE EXIME DE QUALQUER RESPONSABILIDADE PELA
                              EVENTUAL NAO INCLUSAO DE ALGUM REGISTRO EM RAZAO DE ATRASO OU FALTA DO ENCAMINHAMENTO DOS DADOS PELOS
                              DIVERSOS PROVEDORES DE INFORMACOES CONVENIADOS. EM CASO DE DUVIDAS ENTRE EM CONTATO COM NOSSO SUPORTE.</td>
                          </tr>

                          <tr className="bg-slate-50">
                            <td className="px-10 py-2 font-bold">MINUTA DE DECLARAÇÃO LGPD</td>
                            <td className="px-10 py-2">DECLARO QUE A UTILIZAÇÃO DOS DADOS RESPEITARÁ AS FINALIDADES E PROCEDIMENTOS LEGALMENTE ADMITIDOS PELA LEI
                              GERAL DE PROTEÇÃO DE DADOS DIVULGADOS EM MINHA PÁGINA INICIAL DE ACESSO.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Etapa4ConsultaVeicular;
