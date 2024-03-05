// pages/layout.js (or any component)
import styles from '../styles/globals.module.css'

function Layout({ children }) {
	return <div className={styles.container}>{children}</div>
}

export default Layout
