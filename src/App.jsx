import React, { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";


function App() {
	const [todo, setTodo] = useState("")
	const [todos, setTodos] = useState([])
	const [showHidden, setshowHidden] = useState(false)

	useEffect(function(){
		let todoItems = JSON.parse(localStorage.getItem("todo"));
		if (todoItems){
			setTodos(todoItems)
		}
		
	}, [])

	function saveToLocalStorage(){
		localStorage.setItem("todo", JSON.stringify(todos));
	}

	function handleAdd() {
		setTodos([...todos, { todo, isEditing: false, isCompleted: false, id: uuidv4() }]);
		setTodo("");
		saveToLocalStorage();
	}

	function handleCheckbox(e) {
		const id = e.target.dataset.id;
		setTodos(todos.map(todoItem => {
		if (todoItem.id === id) {
			return { ...todoItem, isCompleted: !todoItem.isCompleted };
		}
		return todoItem;
		}));
	}

	function handleEdit(id) {
		setTodos(todos.map(todoItem => {
			if (todoItem.id === id) {
				return { ...todoItem, isEditing: !todoItem.isEditing };
			}
			return todoItem;
		}));
	}

	function handleDelete(id) {
		setTodos(todos.filter(todoItem => todoItem.id !== id));
		saveToLocalStorage();
	}

	function handleChange(e, id) {
		const newTodos = todos.map(todoItem => {
			if (todoItem.id === id) {
				return { ...todoItem, todo: e.target.value };
			}

			return todoItem;
		});
		setTodos(newTodos);
		saveToLocalStorage();
	}

	function handleToggle(e){
		setshowHidden(!showHidden);
	}

	return (
		<>
		<Navbar/>
		<div className="container mx-auto my-5 rounded-xl p-5 bg-violet-300 min-h-[80vh] w-1/2">
			<div className="addTodo">
			<h2 className="text-lg font-bold">Add a Todo</h2>
			<div className='flex justify-start items-center'>
			<input onChange={e => setTodo(e.target.value)} value={todo} type="text" className='my-5 w-[650px]' />
			<button onClick={handleAdd} disabled={todo.length <= 3} className="bg-violet-800 hover:cursor-pointer hover:bg-violet-950 px-2 py-1 font-bold text-white rounded-md mx-6">
				<IoIosAddCircle className="h-7 w-7" />
			</button>
			</div>
			
			</div>
			<h2 className='text-lg font-bold'>Your Todos</h2>

			<div className="flex gap-2">
				<input onChange={handleToggle} checked={showHidden} type="checkbox"/>
				<div>Show Hidden</div>
			</div>
			<div className="todos flex flex-col gap-3">
			{todos.map((item) => {
				return (showHidden || !item.isCompleted) && (
					<div key={item.id} className="w-[100%] flex justify-between items-center">
						<div className="flex items-center gap-2">
							<input className="hover:cursor-pointer" onChange={handleCheckbox} type="checkbox" data-id={item.id} checked={item.isCompleted}/>
							{item.isEditing ?
							<input className="w-[650px] hover:cursor-pointer" onChange={e=>handleChange(e, item.id)} type="text" value={item.todo} /> :
							<div className={item.isCompleted ? "line-through break-words w-[650px]" : "break-words w-[650px]"}>{item.todo}</div>}
						</div>
						<div className="buttons flex justify-center items-center">
							<button onClick={() => handleEdit(item.id)} className="h-10 hover:cursor-pointer bg-violet-800 hover:bg-violet-950 px-2 py-1 font-bold text-white rounded-md mx-1">{item.isEditing?<FaSave />:<FaEdit />}</button>
							<button onClick={() => handleDelete(item.id)} className="h-10 hover:cursor-pointer bg-violet-800 hover:bg-violet-950 px-2 py-1 font-bold text-white rounded-md mx-1"><MdDelete /></button>
						</div>
					</div>
				)
			})}
			</div>
		</div>
		</>
	)
}

export default App
