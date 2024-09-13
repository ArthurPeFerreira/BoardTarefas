import styles from "@/pages/dashboard/styles.module.css"
import { GetServerSideProps } from "next";
import Head from "next/head"
import { getSession } from "next-auth/react";
import Textarea from "@/components/Textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faTrash } from "@fortawesome/free-solid-svg-icons";

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
                            <Textarea placeholder="Digite qual sua Tarefa..."/>
                            <div className={styles.checkboxarea}>
                                <input type="checkbox" className={styles.checkbox}/>
                                <label>Deixar tarefa publica?</label>   
                            </div>
                            <button type="submit" className={styles.button}>Registrar</button>
                        </form>
                    </div>
                </section>
                <section className={styles.taskConteiner}>
                    <h1 className={styles.taskTitle}>Minhas Tarefas</h1>

                    <div className={styles.taskContent}>
                        <div className={styles.infoContent}>
                            <div className={styles.publicContent}>
                                <label className={styles.taskPublic}>PUBLICO</label> 
                                <button className={styles.shareButton}>
                                    <FontAwesomeIcon icon={faShare} color="#3183ff" />
                                </button> 
                                
                            </div>
                            <div className={styles.taskInfo}>
                                <p className={styles.taskDescripton}>Task digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitadaTask digitada</p>
                            </div>
                        </div>
                        <button className={styles.trashButton}>
                            <FontAwesomeIcon icon={faTrash} size="xl" className={styles.trashIcon}/>
                        </button>
                        
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