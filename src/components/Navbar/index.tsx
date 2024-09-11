import { useSession, signIn, signOut } from 'next-auth/react';
import styles from '@/components/Navbar/styles.module.css';
import Link from 'next/link';

export default function Navbar() {  

    const { data: session, status} = useSession();

    return (
        <main className={styles.main}>
        <nav className={styles.navbar}>
            <div className={styles.logoDisplay}>
                <Link href="/" className={styles.content}>
                    <h1 className={styles.logo}>Tarefas <span>+</span></h1>
                </Link>
               
                {session?.user && (
                    <Link href="/dashboard" className={styles.content}>
                        <button className={styles.painelButton}>Meu Painel</button>
                    </Link>
                ) }
            </div>
            {status === "loading" ? (
                <button className={styles.loginButton} onClick={ () => signIn("google") }>Fazer Login</button>
            ) : ( session ? (
                <button className={styles.loginButton} onClick={ () => signOut() }>Olá {session?.user?.name}</button>
                ) : (
                <button className={styles.loginButton} onClick={ () => signIn("google") }>Fazer Login</button>
                )
            )
        }
        </nav>
        </main>
    );
}