// pages/layout.js (or any component)
// import styles from '.Home.module.css'

function Layout({ children }) {
	return <div className={styles.container}>{children}</div>
}

export default Layout
