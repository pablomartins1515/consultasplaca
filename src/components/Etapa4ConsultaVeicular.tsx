import React, { useState, useRef, useEffect } from 'react';
import { VehicleData } from '../context/types';
import { useVehicleContext } from '../context/VehicleContext';
import BottomWhatsApp from './BottomWhatsApp';
import Link from 'next/link';

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

  const [html2pdf, setHtml2pdf] = useState<any>(null);


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

  //FUNCAO IMPRIMIR

  useEffect(() => {
    // Importar html2pdf.js apenas no cliente
    import('html2pdf.js').then((module) => {
      setHtml2pdf(() => module.default);
    }).catch((error) => {
      console.error("Erro ao carregar html2pdf.js:", error);
    });
  }, []);

  const printDocument = () => {
    window.print();
  };

  const saveAsPdf = () => {
    if (!html2pdf) {
      console.error("html2pdf não está disponível.");
      return;
    }

    const element = document.getElementById('contentToCapture');
    if (element) {
      // Adiciona a classe para diminuir o tamanho da fonte
      element.classList.add('small-font');

      const opt = {
        margin: 0, // Define margem zero
        filename: `consulta-completa-${placa}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' } // Define orientação paisagem
      };

      html2pdf().from(element).set(opt).save().catch((error: any) => {
        console.error("Erro ao gerar o PDF:", error);
      }).finally(() => {
        // Remove a classe após gerar o PDF, se necessário
        element.classList.remove('small-font');
      });
    } else {
      console.error("Elemento com id 'contentToCapture' não encontrado.");
    }
  };


  return (
    <div className='w-full mb-28'>
      {showForm && (
        <form onSubmit={handleBoth}>

          <div className='text-center flex justify-center p-10'>
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
                {error && <p className='text-red-500 text-sm m-4  '> {error}</p>}

              </div>
              {error && (
                <div className='flex items-center px-20 md:px-36 justify-centercontent-center text-center'>
                  <div className='text-center pt-2 '>

                    <div className='text-center pt-2'>
                      <div className='text-center pt-2'>
                        <Link href="/suporte" legacyBehavior>
                          <a className="m-2 px-2 w-96 h-20 text-3xl gap-2 shadow flex justify-center items-center border border-transparent font-semibold rounded-lg text-white bg-green-600 hover:bg-yellow-500 animate-bounce">
                            Suporte WhatsApp
                            <div className='ml-2'>
                              <BottomWhatsApp />
                            </div>
                          </a>
                        </Link>
                      </div>
                    </div>

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

              <div className=' sm:min-w-full sm:w-[64rem]  '>

                <div className='text-2xl bg-red pt-10 mb-4 '>

                  <h1 className=' invisible  -mb-14 px w-full flex justify-center content-center  text-center print:visible font-bold text-5xl text-blue-900'> Consulta Completa:</h1>

                  <div className=" text-sm flex sm:flex-row  sm:px-20 bg-white justify-center items-center content-center sm:gap-20 sm:text-xl print:invisible ">
                    <button onClick={copyToClipboard} className="m-2 bg-green-600 text-white px-8 py-2 sm:px-16 sm:py-4 hover:bg-green-500 rounded-md print:invisible ">
                      Copiar Dados
                    </button>
                    <button
                      className=" bg-yellow-400 text-white sm:px-16 p-0 m-2 px-8 py-2 sm:py-4 sm:m-2 rounded-md  hover:bg-yellow-500 sm:visible print:invisible print:hover:invisible"
                      onClick={printDocument}>SALVAR PDF
                    </button>
                    <button
                      className='m-2 sm:px-16 sm:py-4 bg-blue-600 rounded-md px-8 py-2 text-white hover:bg-blue-800 print:invisible'
                      onClick={saveAsPdf}>BAIXAR PDF
                    </button>
                  </div>

                  <div className='  flex flex-col col-span-1 items-center ' id="contentToCapture" >
                    <h2 className=" flex content-center items-center py-5 h-12 mx-8 my-8 pb-6 text-lg justify-center w-full sm:text-2xl font-bold mb-4 bg-blue-900 text-gray-50 text-center rounded-md">INFORMAÇÕES DO VEÍCULO</h2>
                    <div className=" flex flex-col col-span-1 sm:flex-row sm:row-span-2  px-4 sm:px-8 items-center justify-center text-center sm:gap-10 text-xs sm:text-xl sm:flex sm:flex-1 sm:justify-between  sm:mx-5">
                      <div className="  bg-blue-600 divide-gray-50 justify-between rounded-lg overflow-hidden shadow-md">
                        <div className="bg-slate-50 divide-gray-200 text-start flex flex-col col-span-2 ">
                          <div className='bg-slate-50 flex mt-4'>
                            <p className="px-10 py-2"><strong>PLACA:</strong> {vehicleData.placa}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>RENAVAM:</strong> {vehicleData.renavam}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>CHASSI:</strong> {vehicleData.chassi}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>MOTOR:</strong> {vehicleData.motor}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>CPF ou CNPJ - Proprietário:</strong> {vehicleData.cpf_cnpj_proprietario}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Pronome:</strong> {vehicleData.pronome}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Tipo de documento:</strong> {vehicleData.tipodocumentoproprietario}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Marca:</strong> {vehicleData.marca}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Modelo:</strong> {vehicleData.modelo}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Cor:</strong> {vehicleData.cor}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Ano de fabricação:</strong> {vehicleData.veianofabr}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Ano Modelo:</strong>{vehicleData.veianomodelo}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Município:</strong> {vehicleData.municipio}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>UF / Estado do veículo:</strong> {vehicleData.uffaturado}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Tipo:</strong> {vehicleData.tipo}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Situação do veículo:</strong> {vehicleData.situacaoveiculo}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Data de licenciamento:</strong>{vehicleData.licdata}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Data de emissão do CRV:</strong> {vehicleData.dataemissaocrv}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Tipo de Documento Faturado:</strong>{vehicleData.tipodocumentofaturado}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>CPF/CNPJ faturado:</strong> {vehicleData.cpfcnpjfaturado}</p>
                          </div>
                          <div className='bg-slate-50 flex mb-5'>
                            <p className="px-10 py-2"><strong>Tipo de Remarcação do Chassi:</strong> {vehicleData.tiporemarcacaochassi}</p>
                          </div>
                        </div>
                      </div>

                      <div className=" my-4 sm:my-0 bg-blue-600 divide-gray-50 justify-between rounded-lg overflow-hidden shadow-md">
                        <div className="bg-slate-50 divide-gray-200 text-start flex flex-col col-span-2 ">
                          <div className='bg-slate-50 flex mt-4 '>
                            <p className="px-10 py-2"><strong>Carroceria:</strong> {vehicleData.carroceria}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Espécie:</strong> {vehicleData.especie}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Chave Retorno:</strong> {vehicleData.chaveretorno}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Categoria:</strong> {vehicleData.veicategoria}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Potência:</strong> {vehicleData.potencia}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Combustível:</strong> {vehicleData.combustivel}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Cilindrada:</strong> {vehicleData.cilindrada}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Capacidade de carga:</strong>{vehicleData.capacidadecarga}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Código categoria:</strong> {vehicleData.codigocategoria}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Código Marca:</strong> {vehicleData.codigomarca}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Código tipo:</strong>{vehicleData.codigotipo}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Procedência:</strong>{vehicleData.veiprocedencia}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Capacidade de Passageiros:</strong> {vehicleData.capacidadepassag}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Número caixa cambio:</strong>{vehicleData.numero_caixacambio}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Número Carroceria:</strong> {vehicleData.numero_carroceria}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Eixo Traseiro Diferencial:</strong> {vehicleData.numero_eixotraseirodif}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Terceiro Eixo:</strong> {vehicleData.numero_terceiroeixo}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>CMT:</strong> {vehicleData.cmt}</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>Código Tipo:</strong> 059286600356</p>
                          </div>
                          <div className='bg-slate-50 flex'>
                            <p className="px-10 py-2"><strong>PBT:</strong> {vehicleData.pbt}</p>
                          </div>
                          <div className='bg-slate-50 flex mb-4'>
                            <p className="px-10 py-2"><strong>Eixos:</strong> {vehicleData.eixos}</p>
                          </div>
                        </div>

                      </div>
                    </div>

                    <h2 className=" flex content-center items-center py-5 h-12 mx-8 my-8 pb-6 text-lg justify-center w-full sm:text-2xl font-bold mb-4 bg-yellow-400 text-gray-50 text-center rounded-md">DÉBITOS PRINCIPAIS</h2>

                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mx-5 text-xs sm:text-xl w-[20rem] sm:w-[64rem]  ">
                      <table className="w-full divide-gray-50 ">
                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Existe Débitos de IPVA?</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.existedebitodeipva}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 font-bold">Valor IPVA:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.debipva} </td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="pl-10 font-bold">Exite Débitos de Multas?</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.existedebitomulta} </td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 font-bold">Valor Débitos de Multa:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.valortotaldebitomulta} </td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td className="pl-10 py-2 font-bold">Existe Débitos de Licenciamento?</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.existedebitodelicenciamento} </td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2 font-bold">Valor do licenciamento:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.existedebitodelicenciamentovl}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2  font-bold">Existe Débito de DPVAT:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.existedebitodedpvat} </td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td className="pl-10 py-2 font-bold">Valor DPVAT:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.dpvat} </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>


                    <h2 className=" flex content-center items-center py-5 h-12 mx-8 my-8 pb-6 text-lg justify-center w-full sm:text-2xl font-bold mb-4 bg-orange-600 text-gray-50 text-center rounded-md">RESTRIÇÕES PRINCIPAIS</h2>
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mx-5 text-xs sm:text-xl w-[20rem] sm:w-[64rem] ">
                      <table className=" w-full  divide-gray-50">
                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Restrição 01:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.outras_restricoes_01} </td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2 font-bold">Restrição 02:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.outras_restricoes_02} </td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Restrição 03:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.outras_restricoes_03} </td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td className="pl-10 py-2 font-bold">Restrição 04:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.outras_restricoes_04}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h2 className=" flex content-center items-center py-6 h-12 mx-8 my-8 pb-6 text-lg justify-center w-full sm:text-2xl font-bold mb-4 bg-red-600 text-gray-50 text-center rounded-md">RESTRICOES ADMINISTRATIVAS E JUDICIAIS</h2>

                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mx-5 text-xs sm:text-xl w-[20rem] sm:w-[64rem] ">
                      <table className=" w-full  divide-gray-50">
                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2 font-bold">Restrição Tributária:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.resadministrativa}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Restrição Judicial: </td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.resjudicial}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Data de Registro DI:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.restritributaria}</td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td className="pl-10 py-2 font-bold">Restrição Renajud:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.resrenajud}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Restrição Ambiental: </td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.resambiental}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Lic. ex.lic:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.licexelic}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Comunicação de Venda:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.ccomunicacaovenda}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Tipo do Comprador: </td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.tipodoccomprador}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h2 className=" flex content-center items-center py-5 h-12 mx-8 my-8 pb-6 text-lg justify-center w-full sm:text-2xl font-bold mb-4 bg-yellow-400 text-gray-50 text-center rounded-md">Outras RESTRIÇÕES</h2>
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mx-5 text-xs sm:text-xl w-[20rem] sm:w-[64rem] ">
                      <table className=" w-full  divide-gray-50">
                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Restricão de Financiamento:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.restricaofinan}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2  font-bold">Restrição Nome agente:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.restricaonomeagente}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2  font-bold">Restrição Arrendatários:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.restricaoarrendatario}</td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td className="pl-10 py-2  font-bold">Restrição Inclusão:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.restricaodatainclusao}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2  font-bold">Restrição Número do Contrato:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.numerocontratofinanceira}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Restrição Código Agente financeiro:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.codigoagentefinanceiro}</td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td className="pl-10 py-2 font-bold">Restrição data vigência do Contrato:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.datavigenciacontratofinanceira}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h2 className=" flex content-center items-center py-5 h-12 mx-8 my-8 pb-6 text-lg justify-center w-full sm:text-2xl font-bold mb-4 bg-green-600 text-gray-50 text-center rounded-md">INFORMAÇÕES TRIBUTÁRIAS</h2>
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mx-5 text-xs sm:text-xl w-[20rem] sm:w-[64rem] ">
                      <table className=" w-full  divide-gray-50">
                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2 font-bold">Pronome Anterior:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.pronomeanterior}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2 font-bold">Restrição CPF/CNPJ Arrendamento:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.restricaocpfcnpjarrendatar}</td>
                          </tr>

                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Intenção Restrição Financiamento: </td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.intencaorestricaofinan}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2 font-bold">Intenção nome Agente</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.intencaonomeagente}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Intenção nome Financiamento:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.intencaonomefinanc}</td>
                          </tr>

                          <tr className="bg-slate-50">
                            <td className="pl-10 py-2 font-bold">Intenção CPF/CNPJ Financiamneto:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.intencaocpfcnpjfinanc}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Data de Intenção Incusão: </td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.intencaodatainclusao}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2 font-bold">Deb. Dersa:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.debdersa}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Dab. Der:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.debder}</td>
                          </tr>
                        </tbody>

                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2 font-bold">Déb. Detran:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.debdetran}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Déb. CETESB: </td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.debcetesb}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2 font-bold">Débitos Renainf</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.debrenainf}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2  font-bold">Débitos Municipais:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.debmunicipais}</td>
                          </tr>

                          <tr className="bg-slate-50">
                            <td className="pl-10 py-2 font-bold">Débitos Polrodfed:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.debpolrodfed}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Restrição de Furto: </td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.resfurto}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Restrição Guinçho</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.resguincho}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h2 className=" flex content-center items-center py-5 h-12 mx-8 my-8 pb-6 text-lg justify-center w-full sm:text-2xl font-bold mb-4 bg-gray-300 text-gray-50 text-center rounded-md">OUTRAS INFORMAÇÕES</h2>
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mx-5 text-xs sm:text-xl w-[20rem] sm:w-[64rem] ">
                      <table className=" w-full  divide-gray-50">
                        <tbody className="bg-white divide-y divide-gray-200 ">
                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2  font-bold"> Comunicado Inclusão :</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.ccomunicinclusao}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2 font-bold">CPF do Comprador:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.cpfcnpjcomprador}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Data da Venda:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.datavenda}</td>
                          </tr>

                          <tr className="bg-slate-50">
                            <td className="pl-10 py-2 font-bold">Nota Fiscal:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.notafiscal}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Protocolo Detran </td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.protocolodetran}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Ano de Inspeção:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.inspecaoano}</td>
                          </tr>

                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2 font-bold">Inspeção Centro:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.inspecaocentro}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Data da Inspeção:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.inspecaodata}</td>
                          </tr>

                          <tr className="bg-slate-50">
                            <td className="pl-10 py-2 font-bold">Selo de inspeção</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.inspecaoselo}</td>
                          </tr>
                          <tr className="">
                            <td className="pl-10 py-2 font-bold">Status da Inspeção: </td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.inspecaostatus}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="px-10 py-2 font-bold">Código Financeira:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.codigofinanceira}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Data inclusão troca financeira:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.datainclusaointencaotrocafinanceira}</td>
                          </tr>
                          <tr className="">
                            <td className="px-10 py-2 font-bold">Data limite de restrição Tributária: </td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.datalimiterestricaotributaria}</td>
                          </tr>
                          <tr className='bg-slate-50'>
                            <td className="pl-10 py-2 font-bold">Tempo de execução:</td>
                            <td className="pr-10 pl-5 py-2">{vehicleData.tempoexecucao}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h2 className=" flex content-center items-center py-5 h-12 mx-8 my-8 pb-6 text-lg justify-center w-full sm:text-2xl font-bold mb-4 bg-gray-300 text-gray-50 text-center rounded-md">ALERTA E LGPD</h2>
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mx-5 w-[20rem] sm:w-[64rem] ">
                      <table className=" w-full  divide-gray-50 text-xs sm:text-sm p-10 font-normal">
                        <tbody className="bg-white divide-y divide-gray-200  ">
                          <tr className='bg-slate-50 flex flex-col col-span-1 '>
                            <td className="px-10 py-2 pt-3 font-bold">INFORMAÇÕES IMPORTANTES:</td>
                            <td className="px-10 pb-2">ESTAS INFORMAÇÕES SÃO CONFIDENCIAIS E DEVERÃO SER UTILIZADAS, ÚNICA E EXCLUSIVAMENTE, PARA ORIENTAÇÃO DAS
                              TRANSAÇÕES COMERCIAIS DO USUÁRIO , RESPONSABILIZANDO-SE CIVIL E CRIMINALMENTE POR DANOS QUE OCASIONAR A
                              TERCEIROS, QUANDO UTILIZADAS EM DESACORDO COM A LEGISLAÇÃO EM VIGOR. EM CASO DE DÚVIDAS ENTRE EM CONTATO PELO
                              FALE CONOSCO.</td>
                          </tr>
                          <tr className='bg-slate-50 flex flex-col col-span-1 '>
                            <td className="px-10 py-2 pt-3 font-bold">AVISO:</td>
                            <td className="px-10 pb-2">AINDA QUE EMPREGANDO OS MELHORES ESFORCOS, NOSSA EMPRESA SE EXIME DE QUALQUER RESPONSABILIDADE PELA
                              EVENTUAL NAO INCLUSAO DE ALGUM REGISTRO EM RAZAO DE ATRASO OU FALTA DO ENCAMINHAMENTO DOS DADOS PELOS
                              DIVERSOS PROVEDORES DE INFORMACOES CONVENIADOS. EM CASO DE DUVIDAS ENTRE EM CONTATO COM NOSSO SUPORTE.</td>
                          </tr>

                          <tr className='bg-slate-50 flex flex-col col-span-1 '>
                            <td className="px-10 py-2 pt-3 font-bold">MINUTA DE DECLARAÇÃO LGPD</td>
                            <td className="px-10 pb-2">DECLARO QUE A UTILIZAÇÃO DOS DADOS RESPEITARÁ AS FINALIDADES E PROCEDIMENTOS LEGALMENTE ADMITIDOS PELA LEI
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
function setHtml2pdf(arg0: () => any) {
  throw new Error('Function not implemented.');
}

