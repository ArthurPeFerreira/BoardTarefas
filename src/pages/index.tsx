import Head from "next/head";
import styles from "@/styles/home.module.css";
import Image from "next/image";
import heroImg from "@/../images/hero.png"

export default function Home() {
  return (
    <div className={styles.container}>

      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image src={heroImg} alt="Logo Tarefas+" className={styles.hero} priority/>
          <h1 className={styles.title}>Sistema feito para você organizar <br/> seus estudos e tarefas</h1>
        </div>
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+12 Posts</span>
          </section>
          <section className={styles.box}>
            <span>+12 Comentarios</span>
          </section>
        </div>
      </main>
    </div>
  );
}
