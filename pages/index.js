import React, { useState, useEffect } from 'react'
import {
	collection,
	addDoc,
	query,
	onSnapshot,
	deleteDoc,
	doc
} from 'firebase/firestore'
import { db } from '../firebase/initFirebase' // Import the initialized Firestore database
import Image from 'next/image'

export default function Home() {
	const [items, setItems] = useState([])
	const [newItem, setNewItem] = useState({ name: '', price: '' })
	const [total, setTotal] = useState(0)
	const [currency, setCurrency] = useState('$') // Default currency symbol
	const [currentDate, setCurrentDate] = useState('') // Current date

	// Function to get the current date
	const getCurrentDate = () => {
		const date = new Date()
		const formattedDate = `${date.getFullYear()}-${
			date.getMonth() + 1
		}-${date.getDate()}`
		setCurrentDate(formattedDate)
	}

	const addItem = async (e) => {
		e.preventDefault()
		if (newItem.name !== '' && newItem.price !== '') {
			await addDoc(collection(db, 'items'), {
				name: newItem.name.trim(),
				price: newItem.price
			})
			setNewItem({ name: '', price: '' })
		}
	}

	useEffect(() => {
		const q = query(collection(db, 'items'))
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			let itemsArr = []

			querySnapshot.forEach((doc) => {
				itemsArr.push({ ...doc.data(), id: doc.id })
			})
			setItems(itemsArr)

			const calculateTotal = () => {
				const totalPrice = itemsArr.reduce(
					(sum, item) => sum + parseFloat(item.price),
					0
				)
				setTotal(totalPrice)
			}
			calculateTotal()
		})

		// Set the current date when the component mounts
		getCurrentDate()

		return () => unsubscribe()
	}, [])

	const deleteItem = async (id) => {
		await deleteDoc(doc(db, 'items', id))
	}

	const clearAllItems = async () => {
		// Delete all items from Firestore
		await Promise.all(items.map((item) => deleteDoc(doc(db, 'items', item.id))))
	}

	const handleCurrencyChange = (e) => {
		setCurrency(e.target.value)
	}

	return (
		<main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4'>
			<Image
				width='200'
				height='200'
				src='/logo.png'
				alt='Logo'
				className='absolute top-2 left-4'
			/>
			<div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm '>
				<h1 className='text-4xl p-4 text-center'>Expense Tracker</h1>
				<p className='text-white text-sm mb-4 text-center'>
					Expenses Date: {currentDate}
				</p>
				<div className='bg-[#3f2974] p-4 rounded-lg'>
					<form className='grid grid-cols-6 items-center text-black'>
						<input
							value={newItem.name}
							onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
							className='col-span-3 p-3 border'
							type='text'
							placeholder='Enter Item'
						/>
						<input
							value={newItem.price}
							onChange={(e) =>
								setNewItem({ ...newItem, price: e.target.value })
							}
							className='col-span-2 p-3 border mx-3'
							type='number'
							placeholder='Enter Cost'
						/>
						<button
							onClick={addItem}
							className='text-white bg-[#181818] hover:bg-slate-900 p-3 text-xl'
							type='submit'
						>
							+
						</button>
					</form>
					<ul>
						{items.map((item) => (
							<li
								key={item.id}
								className='my-4 w-full flex justify-between bg-[#181818]'
							>
								<div className='p-4 w-full flex justify-between text-white'>
									<span className='capitalize text-white'>{item.name}</span>
									<span>
										{currency} {item.price}
									</span>
								</div>
								<button
									onClick={() => deleteItem(item.id)}
									className='ml-8 p-4 border-l-2 bg-[#181818] hover:bg-slate-900 w-16'
								>
									X
								</button>
							</li>
						))}
					</ul>
					{items.length > 0 && (
						<div className='flex justify-between p-3'>
							<span>Total</span>
							<span>
								{currency} {total}
							</span>
						</div>
					)}
					{items.length > 0 && (
						<div className='flex justify-end'>
							<button
								onClick={clearAllItems}
								className='bg-red-600 text-white px-4 py-2 rounded-md mt-4'
							>
								Clear All
							</button>
						</div>
					)}
					<div className='flex justify-end mt-4'>
						<select
							value={currency}
							onChange={handleCurrencyChange}
							className='bg-white text-black p-2 rounded-md'
						>
							<option value='$'>USD ($)</option>
							<option value='€'>EUR (€)</option>
							<option value='£'>GBP (£)</option>
							<option value='¥'>JPY (¥)</option>
							<option value='₹'>INR (₹)</option>
							<option value='R'>ZAR (R)</option>
							{/* Add more currencies as needed */}
						</select>
					</div>
				</div>
			</div>
		</main>
	)
}
