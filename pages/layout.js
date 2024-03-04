import '../styles/globals.css' // Assuming your global styles are in 'styles/globals.css'
import { Inter } from 'next/font/google'
import { metadata } from './constants'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<head>
				<link
					rel='stylesheet'
					href={`https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap`}
				/>
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	)
}
