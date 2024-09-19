"use client";
import styles from "@/pages/dashboard/styles.module.css";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import Textarea from "@/components/Textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { db } from "@/services/firebaseConnection";
import {
  doc,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";

interface UserProps {
  user: {
    nome: string;
    email: string;
  };
}

interface TasksProps {
  id: string;
  created: Date;
  isPublic: boolean;
  tarefa: string;
  user: string;
  user_email: string;
}

export default function Dashboard({ user }: UserProps) {
  const [input, setInput] = useState("");
  const [publickTask, setpublicTask] = useState(false);
  const [tasks, setTasks] = useState<TasksProps[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      const tarefasRef = collection(db, "Tarefas");

      const q = query(
        tarefasRef,
        orderBy("created", "desc"),
        where("user_email", "==", user.email)
      );

      onSnapshot(q, (snapshot) => {
        let lista = [] as TasksProps[];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            created: doc.data().created,
            isPublic: doc.data().isPublic,
            tarefa: doc.data().tarefa,
            user: doc.data().user,
            user_email: doc.data().user_email,
          });
        });
        setTasks(lista);
      });
    };

    loadTasks();
  }, [user.email]);

  console.log(tasks);

  function handleInput(event: ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value);
  }

  function handlePublic(event: ChangeEvent<HTMLInputElement>) {
    setpublicTask(event.target.checked);
  }

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );
  }

  async function handleDeleteTask(id: string) {
    const taskDoc = doc(db, "Tarefas", id);

    try {
      await deleteDoc(taskDoc);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (input === "") {
      alert("Você não digitou nada!");
    } else {
      try {
        await addDoc(collection(db, "Tarefas"), {
          tarefa: input,
          created: new Date(),
          user: user.nome,
          user_email: user.email,
          isPublic: publickTask,
        });

        setInput("");
        setpublicTask(false);
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
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
                onChange={handleInput}
              />
              <div className={styles.checkboxarea}>
                <input
                  type="checkbox"
                  checked={publickTask}
                  onChange={handlePublic}
                  className={styles.checkbox}
                />
                <label>Deixar tarefa publica?</label>
              </div>
              <button type="submit" className={styles.button}>
                Registrar
              </button>
            </form>
          </div>
        </section>
        <section className={styles.taskConteiner}>
          {tasks.length === 1 ? (
            <h1 className={styles.taskTitle}>Minhas Tarefas</h1>
          ) : (
            <></>
          )}
          {tasks.length === 0 ? (
            <p>Você não tem Tarefas Cadastradas!</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className={styles.taskContent}>
                <div className={styles.infoContent}>
                  {task.isPublic ? (
                    <>
                      <div className={styles.publicContent}>
                        <label className={styles.taskPublic}>PUBLICO</label>
                        <button
                          className={styles.shareButton}
                          onClick={() => handleShare(task.id)}
                        >
                          <FontAwesomeIcon icon={faShare} color="#3183ff" />
                        </button>
                      </div>
                      <div className={styles.taskInfo}>
                        <Link
                          className={styles.taskDescripton}
                          href={`/task/${task.id}`}
                        >
                          <p>{task.tarefa}</p>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className={styles.taskInfo}>
                      <p>{task.tarefa}</p>
                    </div>
                  )}
                </div>
                <button
                  className={styles.trashButton}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    size="xl"
                    className={styles.trashIcon}
                  />
                </button>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        nome: session?.user?.name, // Corrigido aqui para `nome`
        email: session?.user?.email,
      },
    },
  };
};
