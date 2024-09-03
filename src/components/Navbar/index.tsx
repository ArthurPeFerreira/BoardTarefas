import styles from '@/components/Navbar/styles.module.css';
import Link from 'next/link';

export default function Navbar() {  
    return (
        <nav className={styles.navbar}>
            <div className={styles.logoDisplay}>
                <Link href="/" className={styles.content}>
                    <h1 className={styles.logo}>Tarefas <span>+</span></h1>
                </Link>
                <Link href="/dashboard" className={styles.content}>
                <button className={styles.painelButton}>Meu Painel</button>
                </Link>
            </div>
            <button className={styles.loginButton}>Minha Conta</button>
        </nav>
    );
}