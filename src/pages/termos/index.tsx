import Header from '@/components/Header';
import { Rodape } from '@/components/Rodape';
import { Disclosure } from '@headlessui/react'
import { CaretUp } from "phosphor-react";

export default function termos() {
    return (
        <div className="w-full px-4 pt-4 ">

            <Header />
            <div className="p-8  bg-zinc-00 ">
                <h1 className="m-2 p-2 flex justify-center text-center font-black text-4xl text-gray-700">
                    Política de Privacidade
                </h1>
                <h2 className="flex justify-center text-center text-xl text-gray-600">
                    Aviso de Privacidade do aplicativo "BUSCARDADOS" <br />
                </h2>
            </div>

            <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-2 ">
                <Disclosure>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-zinc-100 px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                <text> 1. Quais informações estão presentes neste documento?

                                </text>
                                <CaretUp
                                    className={`${open ? 'rotate-180 transform' : ''
                                        } h-5 w-5 text-gray-700`}
                                />
                            </Disclosure.Button>
                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                <text>
                                    Neste Termo de Uso, o usuário do serviço Aplicativo do <b>BUSCARDADOS </b>
                                    encontrará informações sobre: o funcionamento do serviço e as regras
                                    aplicáveis a ele; o arcabouço legal relacionado à prestação do serviço;
                                    as responsabilidades do usuário ao utilizar o serviço; as responsabilidades
                                    da administração pública ao prover o serviço; informações para contato,
                                    caso exista alguma dúvida ou seja necessário atualizar informações; e o foro responsável.
                                </text>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>

                <Disclosure as="div" className="mt-2">
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-zinc-100 px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                <text>2. Aceitação do Termo de Uso e Política de Privacidade</text>
                                <CaretUp
                                    className={`${open ? 'rotate-180 transform' : ''
                                        } h-5 w-5 text-gray-700`}
                                />
                            </Disclosure.Button>
                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                <text>
                                    Ao utilizar os serviços, o usuário confirma que leu e
                                    compreendeu os Termos e Políticas aplicáveis ao serviço
                                    Aplicativo <b>BUSCARDADOS</b> concorda em ficar vinculado a eles.
                                </text>

                            </Disclosure.Panel>

                            <Disclosure as="div" className="mt-2">
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-zinc-100 px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                            <text>3. Definições</text>
                                            <CaretUp
                                                className={`${open ? 'rotate-180 transform' : ''
                                                    } h-5 w-5 text-gray-700`}
                                            />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                            <text>
                                                Para melhor compreensão deste documento, neste Termo de Uso e Política de Privacidade, consideram-se:<br /><br />
                                                <b>Dado pessoal: </b>informação relacionada a pessoa natural identificada ou identificável.<br />
                                                <b>Titular:</b> pessoa natural a quem se referem os dados pessoais que são objeto de tratamento.<br />
                                                <b>Controlador: </b>pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes
                                                ao tratamento de dados pessoais.<br />
                                                <b>Agentes de tratamento:</b> o controlador.<br />
                                                <b>Controlador:</b> pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome
                                                do controlador.<br />
                                                <b>Tratamento: </b>toda operação realizada com dados pessoais, como as que se referem a coleta,
                                                produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição,
                                                processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação,
                                                modificação, comunicação, transferência, difusão ou extração.<br />
                                                <b>Uso compartilhado de dados:</b> comunicação, difusão, transferência internacional,
                                                interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais
                                                por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e
                                                entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de
                                                tratamento permitidas por esses entes públicos, ou entes privados.<br />
                                                <b>Sítios (sites) e aplicativos:</b> sítios e aplicativos por meio dos quais o usuário acessa os
                                                serviços e conteúdos disponibilizados.<br />
                                                <b>Terceiro:</b> Pessoa ou entidade que não participa diretamente em um contrato, em um ato jurídico
                                                ou em um negócio, ou que, para além das partes envolvidas, pode ter interesse num processo jurídico.<br />
                                                <b>Usuários (ou "Usuário", quando individualmente considerado):</b>  todas as pessoas naturais que utilizarem
                                                o serviço Aplicativo e site do BUSCARDADOS.<br />

                                            </text>

                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>

                            <Disclosure as="div" className="mt-2">
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-zinc-100 px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                            <text>4. Por que é importante consultar?</text>
                                            <CaretUp
                                                className={`${open ? 'rotate-180 transform' : ''
                                                    } h-5 w-5 text-gray-700`}
                                            />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                            <text>Grande parte dos carros usados que são vendidos no Brasil tem problemas em seu histórico que, além de diminuírem o seu valor de mercado, podem impedir a realização de um seguro ou até mesmo a transferência para o seu nome. A consulta veicular é a melhor forma de evitar prejuízos financeiros e garantir a compra do melhor carro usado ou seminovo. </text>

                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>

                            <Disclosure as="div" className="mt-2">
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-zinc-100 px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                            <text>5. Descrição do serviço </text>
                                            <CaretUp
                                                className={`${open ? 'rotate-180 transform' : ''
                                                    } h-5 w-5 text-gray-700`}
                                            />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                            <text> Para fazer a consulta do Renavam, você precisa saber o número da placa ou do chassi do veículo. Depois é só escolher uma das nossas consultas. Se você só quer descobrir o número do Renavam pela placa, indicamos a Consulta de Dados Cadastrais do Veículo. </text>

                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>

                            <Disclosure as="div" className="mt-2">
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-zinc-100 px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                            <text>6. Agentes de tratamento</text>
                                            <CaretUp
                                                className={`${open ? 'rotate-180 transform' : ''
                                                    } h-5 w-5 text-gray-700`}
                                            />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                            <text>
                                                7. A quem compete as decisões referentes ao tratamento de dados pessoais realizado
                                                no serviço BUSCARDADOS (Controlador)? <br />
                                                Para o serviço Aplicativo BUSCARDADOS, as decisões referentes ao tratamento
                                                de dados pessoais são de responsabilidade da EMPRESA I9Ativa S.A. Endereço: Rua José do
                                                Egito n° 82  - São Raimundo das Mangabeiras - MA - CEP 65.840-000. Telefone: +55 (99) 9 84574733.
                                            </text>

                                        </Disclosure.Panel>


                                    </>
                                )}
                            </Disclosure>

                            <Disclosure as="div" className="mt-2">
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-zinc-100 px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                            <text>8. Quais são as leis e normativos aplicáveis a esse Termo?</text>
                                            <CaretUp
                                                className={`${open ? 'rotate-180 transform' : ''
                                                    } h-5 w-5 text-gray-700`}
                                            />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                            <text>
                                                Lei nº 12.965, de 23 de abril de 2014 - Marco Civil da Internet – Estabelece princípios, garantias, direitos e deveres para o uso da Internet no Brasil.<br />
                                                Lei nº 12.527, de 18 de novembro de 2011 - Lei de Acesso à Informação – Regula o acesso a informações previsto na Constituição Federal.<br />
                                                Lei nº 13.460, de 26 de junho de 2017 - Dispõe sobre participação, proteção e defesa dos direitos do usuário dos serviços públicos da administração pública.<br />
                                                Lei nº 13.709, de 14 de agosto de 2018 - Dispõe sobre o tratamento de dados pessoais, inclusive nos meios digitais, por pessoa natural ou por pessoa jurídica de direito público ou privado, com o objetivo de proteger os direitos fundamentais de liberdade e de privacidade e o livre desenvolvimento da personalidade da pessoa natural.<br />
                                                Decreto nº 8.777, de 11 de maio de 2016 - Institui a Política de Dados Abertos do Poder Executivo federal.<br />
                                                Decreto nº 7.724, de 16 de maio de 2012 - Regulamenta a Lei no 12.527, de 18 de novembro de 2011 (Lei de Acesso à Informação), que dispõe sobre o acesso a informações previsto na Constituição Decreto nº 10.046, de 09 de outubro de 2019 - Dispõe sobre a governança no compartilhamento de dados no âmbito da administração pública federal e institui o Cadastro Base do Cidadão e o Comitê Central de Governança de Dados.<br />
                                            </text>

                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>

                            <Disclosure as="div" className="mt-2">
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-zinc-100 px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                            <text>7. Quais são os direitos do usuário do serviço?</text>
                                            <CaretUp
                                                className={`${open ? 'rotate-180 transform' : ''
                                                    } h-5 w-5 text-gray-700`}
                                            />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                            <text>
                                                RENAVAM significa Registro Nacional de Veículos Automotores e o
                                                O usuário do serviço possui os seguintes direitos, conferidos pela Lei de Proteção de Dados Pessoais:
                                                - Direito de confirmação e acesso (Art. 18, I e II): é o direito do usuário de obter do serviço a confirmação de que os dados pessoais que lhe digam respeito são ou não objeto de tratamento e, se for esse o caso, o direito de acessar os seus dados pessoais.
                                                - Direito de retificação (Art. 18, III): é o direito de solicitar a correção de dados incompletos, inexatos ou desatualizados.
                                                - Direito à limitação do tratamento dos dados (Art. 18, IV): é o direito do usuário de limitar o tratamento de seus dados pessoais, podendo exigir a eliminação de dados desnecessários, excessivos ou tratados em desconformidade com o disposto na Lei Geral de Proteção de Dados.
                                                - Direito de oposição (Art. 18, § 2º): é o direito do usuário de, a qualquer momento, se opor ao tratamento de dados por motivos relacionados com a sua situação particular, com fundamento em uma das hipóteses de dispensa de consentimento ou em caso de descumprimento ao disposto na Lei Geral de Proteção de Dados.
                                                - Direito de não ser submetido a decisões automatizadas (Art. 20, LGPD): o titular dos dados tem direito a solicitar a revisão de decisões tomadas unicamente com base em tratamento automatizado de dados pessoais que afetem seus interesses, incluídas as decisões destinadas a definir o seu perfil pessoal, profissional, de consumo e de crédito ou os aspectos de sua personalidade.
                                            </text>

                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>

                            <Disclosure as="div" className="mt-2">
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-zinc-100 px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                            <text>8. Quais são as obrigações dos usuários que utilizam o serviço?</text>
                                            <CaretUp
                                                className={`${open ? 'rotate-180 transform' : ''
                                                    } h-5 w-5 text-gray-700`}
                                            />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                            <text>
                                                O login e senha só poderão ser utilizados pelo usuário cadastrado. Ele se compromete em manter o sigilo da senha, que é pessoal e intransferível, não sendo possível, em qualquer hipótese, a alegação de uso indevido, após o ato de compartilhamento.
                                                O Usuário é responsável pela reparação de todos e quaisquer danos, diretos ou indiretos (inclusive decorrentes de violação de quaisquer direitos de outros usuários, de terceiros, inclusive direitos de propriedade intelectual, de sigilo e de personalidade), que sejam causados à Administração Pública, a qualquer outro Usuário, ou, ainda, a qualquer terceiro, inclusive em virtude do descumprimento do disposto nestes Termos de Uso e Política de Privacidade ou de qualquer ato praticado a partir de seu acesso ao serviço.
                                                O Órgão não poderá ser responsabilizado pelos seguintes fatos:
                                                a. Equipamento infectado ou invadido por atacantes;
                                                b. Equipamento avariado no momento do consumo de serviços;
                                                c. Proteção do computador;
                                                d. Proteção das informações baseadas nos computadores dos usuários;
                                                e. Abuso de uso dos computadores dos usuários;
                                                f. Monitoração clandestina do computador dos usuários;
                                                g. Vulnerabilidades ou instabilidades existentes nos sistemas dos usuários;
                                                h. Perímetro inseguro;
                                            </text>

                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>

                            <Disclosure as="div" className="mt-2">
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-zinc-100 px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                            <text>SOBRE A POLÍTICA DE PRIVACIDADE</text>
                                            <CaretUp
                                                className={`${open ? 'rotate-180 transform' : ''
                                                    } h-5 w-5 text-gray-700`}
                                            />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                            <text>
                                                Esta Política de Privacidade foi elaborada em conformidade com todas as leis que abrem o assunto supracitadas acima, e nela, o usuário do serviço Aplicativo e site do BUSCARDADOS encontrará informações sobre: qual o tratamento dos dados pessoais realizados, de forma automatizada ou não, e a sua finalidade; os dados pessoais dos usuários necessários para a prestação do serviço; a forma como eles são coletados; se há o compartilhamento de dados com terceiros; e quais as medidas de segurança implementadas para proteger os dados.


                                                TERMO DE AUTORIZAÇÃO PARA ENVIO DE MENSAGENS (VIA CELULAR E E-MAIL)
                                                Com a concordância deste termo, declaro que o telefone e e-mail informados são de minha propriedade e autorizo o Ministério da Cidadania a enviar mensagens por esses canais utilizando os dados e autorizações informados por mim no Aplicativo BUSCARDADOS, de acordo com as seguintes condições:
                                                a. o envio de mensagens se dará somente para fins de implementação de políticas públicas e realização de estudos e pesquisas, conforme previsto no Decreto nº 11.016, de 29 de março de 2022, que regulamenta o Cadastro Único, e JAMAIS serão utilizadas para fins comerciais;
                                                b. as mensagens sempre conterão descrição clara do remetente e darão a opção de se remover imediatamente do recebimento de novas mensagens;
                                                c. as mensagens se limitarão a textos e JAMAIS conterão links, endereços de e-mail, propagandas de terceiros, arquivos anexos, solicitação de senha nem pedidos de autorização;
                                                d. o serviço de envio de mensagens será prestado por prazo indeterminado, podendo ser cancelado a qualquer tempo sem aviso prévio, sem prejuízo para minha pessoa ou ainda para a Empresa I9Ativa S.A. a e os seus operadores;
                                                e. a I9Ativa S.A. e os seus operadores não se responsabilizam por problemas nos serviços de celular e e-mail nem por acessos de outras pessoas às mensagens recebidas por mim;
                                                f. as dúvidas sobre o envio de mensagens podem ser esclarecidas pela Central de Atendimento da I9Ativa S.A. , pelo telefone +5599984574733 ou por meio eletrônico: pablo.araujo@alu.unibalsas.edu.br
                                                g. Perímetro inseguro;
                                            </text>

                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        </>
                    )}
                </Disclosure>
            </div>

            <div className=' pt-10'>
                <Rodape />            
            </div>
        </div>
    )
}
