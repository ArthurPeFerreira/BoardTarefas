import styles from "@/pages/dashboard/styles.module.css"
import { GetServerSideProps } from "next";
import Head from "next/head"
import { getSession } from "next-auth/react";
import Textarea from "@/components/Textarea";

export default function Dashboard(){    
    return(
        <div>
            <Head>
                <title>Tarefas+ | Dashboard</title>
            </Head>
            
            <main className={styles.conteiner}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual sua Tarefa?</h1>
                        <form>
                            <Textarea/>
                            <div className={styles.checkboxarea}>
                                <input type="checkbox" className={styles.checkbox}/>
                                <label>Deixar tarefa publica?</label>   
                            </div>
                            <button type="submit" className={styles.button}>Registrar</button>
                        </form>
                    </div>
                </section>
            </main>
            
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