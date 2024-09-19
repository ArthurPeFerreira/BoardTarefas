import Head from "next/head";
import styles from "@/styles/home.module.css";
import Image from "next/image";
import heroImg from "@/../images/hero.png";
import { GetStaticProps } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

interface HomeProps {
  posts: number;
  coments: number;
}

export default function Home({ coments, posts }: HomeProps) {
  // Ajuste aqui
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            src={heroImg}
            alt="Logo Tarefas+"
            className={styles.hero}
            priority
          />
          <h1 className={styles.title}>
            Sistema feito para você organizar <br /> seus estudos e tarefas
          </h1>
        </div>
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+{posts} Posts</span>
          </section>
          <section className={styles.box}>
            <span>+{coments} Comentarios</span> {/* Ajuste aqui */}
          </section>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const commentRef = collection(db, "Comentarios");
  const commentSnapshot = await getDocs(commentRef);

  const taskRef = collection(db, "Tarefas");
  const taskSnapshot = await getDocs(taskRef);

  return {
    props: {
      posts: taskSnapshot.size || 0,
      coments: commentSnapshot.size || 0, // Ajuste aqui
    },
    revalidate: 60,
  };
};
