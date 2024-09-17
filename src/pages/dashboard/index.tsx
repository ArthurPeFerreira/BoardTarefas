"use client"
import styles from "@/pages/dashboard/styles.module.css"
import { GetServerSideProps } from "next";
import Head from "next/head"
import { getSession } from "next-auth/react";
import Textarea from "@/components/Textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { db } from "@/services/firebaseconnection";
import { addDoc, collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

interface UserProps{
    user:{
        nome: string,
        email: string
    }
}

interface TasksProps{
    id: string,
    created: Date,
    isPublic: boolean,
    tarefa: string,
    user: string,
    email: string
}

export default function Dashboard( {user}:UserProps ){    
    const [input, setInput] = useState("");
    const [publickTask, setpublickTask] = useState(false);
    const [tasks, setTasks] = useState<TasksProps[]>([]);

    useEffect(()=>{
        const loadTasks = async () => {
            const tarefasRef = collection(db, "Tarefas");

            const q = query(
                tarefasRef,
                orderBy("created","desc"),
                where("email","==", user.email)
            )
            
            onSnapshot(q, (snapshot) => {
                let lista = [] as TasksProps[];

                snapshot.forEach( (doc)=> {
                    lista.push({
                        id: doc.id,
                        created: doc.data().created,
                        isPublic: doc.data().isPublic,
                        tarefa: doc.data().tarefa,
                        user: doc.data().user,
                        email: doc.data().email
                    })
                });

                setTasks(lista);
            });
        }
        
        loadTasks();

        console.log(tasks)

    },[user.email]);

    

    function handleInput( event:ChangeEvent<HTMLTextAreaElement> ){
        setInput(event.target.value);
    }

    function handlePublic( event:ChangeEvent<HTMLInputElement> ){
        setpublickTask(event.target.checked);
    }

    async function handleRegister(event:FormEvent){
        event.preventDefault();

        if (input===""){
            alert("Você não digitou nada!")
        }else{
            try{
                await addDoc(collection(db,"Tarefas"),{
                    tarefa: input,
                    created: new Date(),
                    user: user.nome,
                    user_email: user.email,
                    isPublic: publickTask
                });

                setInput('');
                setpublickTask(false);

            }catch(e){
                console.log(e);
            }
        }
        

    
        
            
    }

    return(
        <div>
            <Head>
                <title>Tarefas+ | Dashboard</title>
            </Head>
            <main className={styles.conteiner}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual sua Tarefa?</h1>
                        <form onSubmit={handleRegister}>
                            <Textarea 
                             placeholder="Digite qual sua Tarefa..."
                             value={input}
                             onChange={ handleInput}/>
                            <div className={styles.checkboxarea}>
                                <input 
                                 type="checkbox" 
                                 checked={publickTask}
                                 onChange={ handlePublic }
                                 className={styles.checkbox}/>
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
        props: {
            user:{
                nome: session?.user?.name,
                email: session?.user?.email
            }
        }
    };
};