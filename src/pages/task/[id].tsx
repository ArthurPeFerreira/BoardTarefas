import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import Textarea from "@/components/Textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/services/firebaseConnection";
import {
  doc,
  addDoc,
  collection,
  orderBy,
  query,
  where,
  deleteDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";

interface TasksProps {
  id: string;
  created: string;
  isPublic: boolean;
  tarefa: string;
  user: string;
  user_email: string;
}

interface CommentProps {
  id: string;
  comentario: string;
  task_id: string;
  user: string | null | undefined; // Ajustar o tipo para aceitar null ou undefined
  user_email: string | null | undefined; // Ajustar o tipo aqui também, se necessário
}

//Função para Transformar Milissegundos em data
function MilisecondsToTime(muliseconds: number) {
  let creation_date, creation_time, creation_timestamp: string;

  creation_date = new Date(muliseconds).toLocaleDateString();
  creation_time = new Date(muliseconds).toLocaleTimeString();
  creation_timestamp = creation_date + " - " + creation_time;

  return creation_timestamp;
}

export default function Task({
  task,
  coments,
}: {
  task: TasksProps;
  coments: CommentProps[];
}) {
  const { data: session } = useSession();

  const [comentario, setComentario] = useState("");
  const [comments, setComments] = useState<CommentProps[]>(coments || []);

  function handleInput(event: ChangeEvent<HTMLTextAreaElement>) {
    setComentario(event.target.value);
  }

  async function handleComment(event: FormEvent) {
    event.preventDefault();

    if (comentario === "") {
      alert("Você não digitou nada!");
    } else {
      try {
        const docRef = await addDoc(collection(db, "Comentarios"), {
          comentario: comentario,
          created: new Date(),
          user: session?.user?.name,
          user_email: session?.user?.email,
          task_id: task?.id,
        });

        setComentario("");

        const data = {
          id: docRef.id,
          comentario: comentario,
          task_id: task?.id,
          user: session?.user?.name,
          user_email: session?.user?.email,
        };

        setComments((oldItens) => [data, ...oldItens]);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function handleDeleteComment(id: string) {
    try {
      const comentDoc = doc(db, "Comentarios", id);
      await deleteDoc(comentDoc);

      const deletedComment = comments.filter((item) => item.id !== id);

      setComments(deletedComment);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={styles.conteiner}>
      <Head>
        <title>Detalhes da Tarefa</title>
      </Head>
      <div className={styles.content}>
        <div className={styles.contentTask}>
          <div className={styles.taskUserInfo}>
            <p className={styles.taskUser}>{task.user}</p>
            <p className={styles.taskDate}>{task.created}</p>
          </div>

          <p className={styles.taskDescription}>{task.tarefa}</p>
        </div>

        <div className={styles.contentComment}>
          <h1 className={styles.Tittle}>Deixar Comentário</h1>
          <form onSubmit={handleComment}>
            <Textarea
              placeholder="Deixe seu comentário..."
              value={comentario}
              onChange={handleInput}
            />
            <button
              type="submit"
              className={styles.button}
              disabled={!session?.user}
            >
              Enviar Comentário
            </button>
          </form>
        </div>
        <section>
          <h1 className={styles.Tittle}>Todos os Comentários</h1>
          {comments.map((coment) => (
            <div key={coment.id} className={styles.conteinerComment}>
              <div className={styles.infoComment}>
                <p className={styles.commentUser}>{coment.user}</p>
                <p className={styles.commentDescription}>{coment.comentario}</p>
              </div>
              {coment.user_email === session?.user?.email ? (
                <button
                  className={styles.trashButton}
                  onClick={() => handleDeleteComment(coment.id)}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    size="xl"
                    className={styles.trashIcon}
                  />
                </button>
              ) : (
                <></>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  //Variaveis
  let muliseconds: number;
  let creation_timestamp: string;

  const id = params?.id as string;

  //Puxar dados da task
  let task: TasksProps;
  const tarefasRef = doc(db, "Tarefas", id);
  const taskq = await getDoc(tarefasRef);

  muliseconds = taskq.data()?.created?.seconds * 1000;
  creation_timestamp = MilisecondsToTime(muliseconds);

  task = {
    id: id,
    created: creation_timestamp,
    isPublic: taskq.data()?.isPublic,
    tarefa: taskq.data()?.tarefa,
    user: taskq.data()?.user,
    user_email: taskq.data()?.user_email,
  };

  if (taskq.data() === undefined || !taskq.data()?.isPublic) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  //Puxar dados dos Comentarios
  const comentariosRef = collection(db, "Comentarios");
  const comentq = await query(
    comentariosRef,
    orderBy("created", "desc"),
    where("task_id", "==", id)
  );
  const querySnapshot = await getDocs(comentq);

  const coments: CommentProps[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    comentario: doc.data()?.comentario,
    task_id: doc.data()?.task_id,
    user: doc.data()?.user,
    user_email: doc.data()?.user_email,
  }));

  return {
    props: {
      task: task,
      coments: coments,
    },
  };
};
