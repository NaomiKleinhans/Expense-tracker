import { Inter } from 'next/font/google'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<Head>
				<link
					rel='stylesheet'
					href={`https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap`}
				/>
			</Head>
			<body className={inter.className}>{children}</body>
		</html>
	)
}