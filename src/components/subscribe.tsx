import React, { useState, FormEvent } from "react";
import { useCreateSubscriberMutation, useGetSubscribersQuery } from "../graphql/generated";
import { useRouter } from 'next/router';
import axios from 'axios';
import { Input } from "@material-tailwind/react";

interface Props {
    token: string; // Defina o tipo do token como string
}

const Subscribe: React.FC<Props> = ({ token }) => {
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [message, setMessage] = useState('');
    const [whatsappAdm, setWhatsappAdm] = useState('');
    const [createSubscriber, { loading }] = useCreateSubscriberMutation();
    const { data: subscribersData } = useGetSubscribersQuery(); // Obtenha os dados dos assinantes para verificar o email
    const router = useRouter();

    const handleSubscribe = async (event: FormEvent) => {
        event.preventDefault();

        try {
            await createSubscriber({
                variables: {
                    name,
                    whatsapp,
                    message,
                }
            });
            console.log('Inscrição realizada com sucesso.');
            router.push('/subscriberSucess');
        } catch (error) {
            console.error('Erro ao realizar inscrição:', error);
        }
    };

    const handleSendMessage = async (event: FormEvent) => {
        event.preventDefault();


        try {
            // Aqui envia os dados para o WhatsAopp do Inscrito
            const messageText = `\nParabéns!!!!! \nVocê acaba de preencher o cadastro com sucesso! \n\nConfirme seus dados enviados abaixo, e se houver algum erro, confime com nosso Administrador Aleandro: \n\nDados do Inscrito: \nNome: ${name}\nWhatsApp: ${whatsapp}\nMensagem: ${message} \n\nEstá tudo ok?! Então agora é só Aguardar o contato do nosso líder!`;

            const response = await axios.post('https://cluster.apigratis.com/api/v2/whatsapp/sendText', {
                number: whatsapp,
                text: messageText,
                time_typing: 1
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'DeviceToken': 'fdeb9b24-a11f-4ef1-bb9a-81bea55801cb',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Mensagem enviada com sucesso:', response.data);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }

        try {
            // Aqui envia os dados para o WhatsAopp do Inscrito
            const messageText = `\n Oi Adm! \n${name} acaba de preencher o cadastro com sucesso! \n\nVeja abaixo os Dados do Inscrito: \n\n\nNome: ${name}\nWhatsApp: ${whatsapp}\nMensagem: ${message} \n\nCaso haja algum erro, o inscrito lhe informará!`;

            const response = await axios.post('https://cluster.apigratis.com/api/v2/whatsapp/sendText', {
                number: whatsappAdm,
                text: messageText,
                time_typing: 1
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'DeviceToken': 'fdeb9b24-a11f-4ef1-bb9a-81bea55801cb',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Mensagem enviada com sucesso:', response.data);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    };

    const handleSubmitFull = async (event: FormEvent) => {
        event.preventDefault();
        try {
            await handleSubscribe(event);
            await handleSendMessage(event);
        } catch (error) {
            console.error('Erro ao enviar formulário e mensagem:', error);
        }
    };

    const handlePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        // Aplicar a máscara somente se o valor não estiver vazio
        if (value) {
            value = value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, "($1) $2");
            value = value.replace(/(\d)(\d{4})$/, "$1-$2");
        }
        // Definir o valor do WhatsApp usando o setState
        setWhatsapp(value);
    };

    const handlePhone2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        // Aplicar a máscara somente se o valor não estiver vazio
        if (value) {
            value = value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, "($1) $2");
            value = value.replace(/(\d)(\d{4})$/, "$1-$2");
        }
        // Definir o valor do WhatsApp usando o setState
        setWhatsappAdm(value);
    };

    // A máscara será aplicada automaticamente
    React.useEffect(() => {
        setWhatsappAdm('+5599984633422');
    }, []);


    return (
        <div>
            <div className="justify-center items-center flex">
                <h1 className="mt-8 text-[2.5rem]">
                    Formulário dos
                </h1>
            </div>
            <div className="justify-center items-center flex">
                <h2 className="mb-5 text-[3rem]">
                    <strong className="text-blue-900">Aniversariantes</strong>
                </h2>
            </div>
            <div className="p-8 border border-gray-300 rounded  bg-gray-100">
                <strong className="text-gray-600 justify-center text-xl flex items-center mb-5">Inscreva-se:</strong>
                <form onSubmit={handleSubscribe} className="flex flex-col gap-4 w-full">
                    <Input
                        className=" mxy-1  bg-white text-gray-900 rounded px-5 h-14"
                        type="text"
                        color="green"
                        size="lg"
                        label="Seu nome Completo"
                        placeholder="Seu nome Completo"
                        onChange={event => setName(event.target.value)}
                    />
             
                    <Input
                        className=" bg-white mt-1 text-gray-900 rounded px-5 h-14"
                        type="tel"
                        maxLength={15}
                        size="lg"
                        color="green"
                        label="Digite seu WhatsApp"
                        placeholder="Digite seu WhatsApp"
                        value={whatsapp}
                        onChange={event => handlePhone(event)}// Enviar mensagem de confirmacão para inscrito
                    />
                       <input
                            className="flex bg-white text-gray-900 rounded-md px-5 h-28 border border-gray-400"
                            type="text"
                            placeholder="Message"
                            onChange={event => setMessage(event.target.value)}
                        />

                    <input
                        className="bg-gray-200 text-gray-900 rounded px-0 h-0 align-text-top "
                        type="tel"
                        maxLength={15}
                        placeholder="WhatsApp do ADM"
                        value={whatsappAdm}
                        onChange={event => handlePhone2(event)}// Enviar mensagem de confirmacão para  ADM
                    />
                </form>

            </div>
            <div className="justify-center flex items-center">
                <button
                    className="mt-8 bg-green-600 text-white uppercase py-4 px-7 rounded-md font-bold text-sm hover:bg-blue-900 transition-colors disabled:opacity-50"
                    onClick={handleSubmitFull}
                >
                    CONFIRMAR INSCRIÇÃO
                </button>
            </div>

        </div>
    );
}

export default Subscribe;
