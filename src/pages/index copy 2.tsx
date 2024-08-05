import React, { useState, useRef, useEffect } from 'react';
import { VehicleData } from '../context/types';
import { useVehicleContext } from '../context/VehicleContext';
import BottomWhatsApp from '@/components/BottomWhatsApp';


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
  const [placa, setPlaca] = useState<string>("AAA1234");
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
        filename: `pagina-renderizada-${placa}.pdf`,
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
    <div className='min-w-full mb-28'>

      <div id="content-id" ref={targetRef}>
        <div className="  bg-white flex flex-col col-span-1 w-full">
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
                          <p className="px-10 py-2"><strong>PLACA:</strong> AAA1234</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>RENAVAM:</strong> AAA1234</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>CHASSI:</strong> 9BWLB05U5CP042457</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>MOTOR:</strong> 9BWLB05U5CP042457</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>CPF ou CNPJ - Proprietário:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Pronome:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Tipo de documento:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Marca:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Modelo:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Cor:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Ano de fabricação:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Ano Modelo:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Município:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>UF / Estado do veículo:</strong> 05928660035</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Tipo:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Situação do veículo:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Data de licenciamento:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Data de emissão do CRV:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Tipo de Documento Faturado:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>CPF/CNPJ faturado:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex mb-5'>
                          <p className="px-10 py-2"><strong>Tipo de Remarcação do Chassi:</strong> 059286600356</p>
                        </div>
                      </div>
                    </div>

                    <div className=" my-4 sm:my-0 bg-blue-600 divide-gray-50 justify-between rounded-lg overflow-hidden shadow-md">
                      <div className="bg-slate-50 divide-gray-200 text-start flex flex-col col-span-2 ">
                        <div className='bg-slate-50 flex mt-4 '>
                          <p className="px-10 py-2"><strong>Carroceria:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Espécie:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Chave Retorno:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Categoria:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Potência:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Combustível:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Cilindrada:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Capacidade de carga:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Código categoria:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Código Marca:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Código tipo:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Procedência:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Capacidade de Passageiros:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Número caixa cambio:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Número Carroceria:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Eixo Traseiro Diferencial:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Terceiro Eixo:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>CMT:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>Código Tipo:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex'>
                          <p className="px-10 py-2"><strong>PBT:</strong> 059286600356</p>
                        </div>
                        <div className='bg-slate-50 flex mb-4'>
                          <p className="px-10 py-2"><strong>Eixos:</strong> 059286600356</p>
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
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 font-bold">Valor IPVA:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className='bg-slate-50'>
                          <td className="pl-10 font-bold">Exite Débitos de Multas?</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 font-bold">Valor Débitos de Multa:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="pl-10 py-2 font-bold">Existe Débitos de Licenciamento?</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className='bg-slate-50'>
                          <td className="pl-10 py-2 font-bold">Valor do licenciamento:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2  font-bold">Existe Débito de DPVAT:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="pl-10 py-2 font-bold">Valor DPVAT:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
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
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className='bg-slate-50'>
                          <td className="pl-10 py-2 font-bold">Restrição 02:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Restrição 03:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="pl-10 py-2 font-bold">Restrição 04:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
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
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Restrição Judicial: </td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Data de Registro DI:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>

                        <tr className="bg-slate-50">
                          <td className="pl-10 py-2 font-bold">Restrição Renajud:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Restrição Ambiental: </td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className='bg-slate-50'>
                          <td className="px-10 py-2 font-bold">Lic. ex.lic:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Comunicação de Venda:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Tipo do Comprador: </td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
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
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className='bg-slate-50'>
                          <td className="pl-10 py-2  font-bold">Restrição Nome agente:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2  font-bold">Restrição Arrendatários:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="pl-10 py-2  font-bold">Restrição Inclusão:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className='bg-slate-50'>
                          <td className="pl-10 py-2  font-bold">Restrição Número do Contrato:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Restrição Código Agente financeiro:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="pl-10 py-2 font-bold">Restrição data vigência do Contrato:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
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
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className='bg-slate-50'>
                          <td className="pl-10 py-2 font-bold">Restrição CPF/CNPJ Arrendamento:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>

                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Intenção Restrição Financiamento: </td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className='bg-slate-50'>
                          <td className="pl-10 py-2 font-bold">Intenção nome Agente</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Intenção nome Financiamento:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>

                        <tr className="bg-slate-50">
                          <td className="pl-10 py-2 font-bold">Intenção CPF/CNPJ Financiamneto:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Data de Intenção Incusão: </td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className='bg-slate-50'>
                          <td className="pl-10 py-2 font-bold">Deb. Dersa:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Dab. Der:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                      </tbody>

                      <tbody className="bg-white divide-y divide-gray-200 ">
                        <tr className='bg-slate-50'>
                          <td className="pl-10 py-2 font-bold">Déb. Detran:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Déb. CETESB: </td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className='bg-slate-50'>
                          <td className="pl-10 py-2 font-bold">Débitos Renainf</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2  font-bold">Débitos Municipais:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>

                        <tr className="bg-slate-50">
                          <td className="pl-10 py-2 font-bold">Débitos Polrodfed:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Restrição de Furto: </td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Restrição Guinçho</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
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
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className='bg-slate-50'>
                          <td className="pl-10 py-2 font-bold">CPF do Comprador:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Data da Venda:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>

                        <tr className="bg-slate-50">
                          <td className="pl-10 py-2 font-bold">Nota Fiscal:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Protocolo Detran </td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Ano de Inspeção:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>

                        <tr className='bg-slate-50'>
                          <td className="pl-10 py-2 font-bold">Inspeção Centro:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Data da Inspeção:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>

                        <tr className="bg-slate-50">
                          <td className="pl-10 py-2 font-bold">Selo de inspeção</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="pl-10 py-2 font-bold">Status da Inspeção: </td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className='bg-slate-50'>
                          <td className="px-10 py-2 font-bold">Código Financeira:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="px-10 py-2 font-bold">Data inclusão troca financeira:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className="">
                          <td className="px-10 py-2 font-bold">Data limite de restrição Tributária: </td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
                        </tr>
                        <tr className='bg-slate-50'>
                          <td className="pl-10 py-2 font-bold">Tempo de execução:</td>
                          <td className="pr-10 pl-5 py-2">Combustível: </td>
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
          </div>
        </div>
      </div>
      );
};

      export default Etapa4ConsultaVeicular;
