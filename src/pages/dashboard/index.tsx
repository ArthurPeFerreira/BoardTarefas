import styles from "@/pages/dashboard/styles.module.css"
import { GetServerSideProps } from "next";
import Head from "next/head"
import { getSession } from "next-auth/react";
import {  redirect } from "next/navigation";

export default function Dashboard(){    
    return(
        <div>
            <Head>
                <title>Tarefas+ | Dashboard</title>
            </Head>
            <h1>Abasdada</h1>
        </div>
    );
}

export const getServerSideProps : GetServerSideProps = async ({ req }) => {
   
    const session = await getSession({ req });

    if (!session?.user){
        return{
          redirect: {
            destination: "/",
            permanent: false
          }  
        };
    }

    return{
        props: {}
    };
};