// BlogPage.tsx
import Head from "next/head";
import Header from "../../components/Header";
import React from "react";
import { Rodape } from "@/components/Rodape";
import { useGetSubscribersQuery } from "@/graphql/generated";


export default function subscriberSucess() {
    const { data, loading, error } = useGetSubscribersQuery();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error occurred: {error.message}</div>;
    }

    if (!data || !data.subscribers) {
        return <div>No subscribers data available.</div>;
    }


    return (
        <>
            <Head>
                <title>Sucesso </title>
                <meta name="description" content=" "
                />
            </Head>


            <Header />
                <h1 className="justify-center itens-center flex m-4 text-3xl ">
                    Parabéns!!!
                </h1>

                <p className="justify-center itens-center text-center flex flex-1 m-4 font-extrabold text-3xl">
                    Sua inscricão foi 
                </p>

                <p className="justify-center itens-center text-center flex flex-1 m-2 font-extrabold text-3xl text-green-500">
                   realizada com sucesso! 
                </p>


            <div >
                <Rodape />
            </div>
        </>
    );
}
