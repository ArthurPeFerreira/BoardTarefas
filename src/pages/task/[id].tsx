import Head from "next/head";
import styles from "./styles.module.css"
import { GetServerSideProps } from "next";
import Textarea from "@/components/Textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { db } from "@/services/firebaseConnection";
import { doc, addDoc, collection, onSnapshot, orderBy, query, where, deleteDoc, getDoc } from "firebase/firestore";
import Link from "next/link";

interface TasksProps{
    id: string,
    created: string,
    isPublic: boolean,
    tarefa: string,
    user: string,
    user_email: string
}

export default function Task( {task}: {task: TasksProps} ){
    const [comentario, setComentario] = useState("") 


    function handleInput( event:ChangeEvent<HTMLTextAreaElement> ){
        setComentario(event.target.value);
    }




    return(         
        <div className={styles.conteiner}>
            <Head>
                <title>Detalhes da Tarefa</title>
            </Head>
            <div className={styles.content}>
                <div className={styles.contentTask}>
                    <p className={styles.taskUser}>{task.user}</p>
                    <p className={styles.taskDescription}>{task.tarefa}</p>
                </div>
                
                <div className={styles.contentComment}>
                    <h1 className={styles.Tittle}>Deixar Comentário</h1>
                    <form>
                        <Textarea 
                        placeholder="Deixe seu comentário..."
                             value={comentario}
                             onChange={handleInput}
                             /> 
                            <button type="submit" className={styles.button}>Enviar Comentário</button>
                    </form>
                </div> 
                <section>
                    <h1 className={styles.Tittle}>Todos os Comentários</h1>
                    <div className={styles.conteinerComment}>
                        <div className={styles.infoComment}>
                            <p className={styles.commentUser}>Lucas Silva</p>
                            <p className={styles.commentDescription}>Precisamos Fazer isso mesmo</p>
                        </div>
                        <button className={styles.trashButton}>
                                <FontAwesomeIcon icon={faTrash} size="xl" className={styles.trashIcon} />
                        </button>
                    </div>
                </section>
            </div> 
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    let task: TasksProps;
    let muliseconds : number;
    let creation_date, creation_time, creation_timestamp: string;

    const id = params?.id as string;

    const tarefasRef = doc(db, "Tarefas", id);
    
    const q = await getDoc(tarefasRef);
    
    if (q.data() === undefined || !q.data()?.isPublic){
        return{
            redirect:{
                destination: "/",
                permanent: false
            }
        }
    }

    muliseconds = q.data()?.created?.seconds * 1000;
    creation_date = new Date(muliseconds).toLocaleDateString();
    creation_time = new Date(muliseconds).toLocaleTimeString();
    creation_timestamp = creation_date + " - " + creation_time;
    
    task = {
        id: id,
        created: creation_timestamp,
        isPublic: q.data()?.isPublic,
        tarefa: q.data()?.tarefa,
        user: q.data()?.user,
        user_email: q.data()?.user_email
    };

    console.log(task);

    return {
        props: {
            task: task,
        }
    };
};
