import Link from 'next/link';

export function Botao_liberar () {
    return (
        <button className="m-2">
            <Link href="https://wa.me/5599984633422?text=OI.+Tudo+bom%3F+Gostaria+de+realizar+uma+consulta+completa+com+LEIL%C3%83O+e+SINISTRO.+Esta+%C3%A9+a+placa+do+meu+ve%C3%ADculo%3A"
                className="min-w-[150px]  min-h-[32px]  shadow flex justify-center items-center border border-transparent text-xs font-semibold rounded-md text-white bg-yellow-400 hover:bg-yellow-500 animate-pulse"
            >
                👑 Liberar Informações
            </Link>
        </button> 
    )        
}


