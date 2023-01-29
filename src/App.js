import { useEffect, useState } from 'react';
import './App.css';
import { db, auth, provider } from './firebase-config';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, where } from '@firebase/firestore';
import { signInWithPopup } from 'firebase/auth';
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import { BiAddToQueue } from 'react-icons/bi';
import { FcTodoList } from 'react-icons/fc';
import { IoMdCloseCircleOutline } from 'react-icons/io';

import Loading from '../src/loading'




function App() {
  const [todos, setTodos] = useState([]);
  const [todo_desc, setTodoDesc] = useState([]);

  const todosCollectionRef = collection(db, "todos");
  const todosDescCollectionRef = collection(db, "todos-desc");

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [add, setAdd] = useState(false);
  const [addDesc, setAddDesc] = useState(false);
  const [update, setUpdate] = useState(false);
  const [alert, setAlert] = useState(false);
  const [auth_alert, setAuth_alert] = useState(false);
  const [year, setYear] = useState('');

  const [email, setEmail] = useState('');
  const [user_img, setUser_img] = useState('');
  const [user_name, setUser_name] = useState('');


  const user_email = sessionStorage.getItem("email");

  const getTodos = async () => {

    const q = query(todosCollectionRef, where("email", "==", user_email));
    const data = await getDocs(q);
    setTodos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    console.log(todos);
  };
  const getTodos_desc = async () => {
    const data = await getDocs(todosDescCollectionRef);
    setTodoDesc(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    console.log(todo_desc);
  };



  const addTodo = async () => {
    await addDoc(todosCollectionRef, { title: title, email: email });
    getTodos();
    getTodos_desc();
  };
  const addTodoTask = async (id) => {
    if (description === '') {
      setAlert(true);
      return;
    }
    await addDoc(todosDescCollectionRef, { description: description, check: false, todo_id: id });
    setAddDesc(false);
    getTodos();
    getTodos_desc();
  };

  const updateTodo = async (id, title) => {
    if (title === '') {
      setAlert(true);
      return;
    }
    const todoDoc = doc(db, "todos", id);
    const newFields = { title: title };
    await updateDoc(todoDoc, newFields)
    getTodos();
    getTodos_desc();
  };

  const submitCheck = async (id_task, checked) => {
    const todo_desc = doc(db, "todos-desc", id_task);
    const newFields = { check: checked };
    await updateDoc(todo_desc, newFields);
  };

  const deleteTodo = async (id) => {
    var result = window.confirm("are you sure !");
    console.log(result);
    if (result === true) {
      const todoDoc = doc(db, "todos", id);
      await deleteDoc(todoDoc);
      getTodos();
      getTodos_desc();
    }

  };
  const deleteTodoTask = async (id) => {
    var result = window.confirm("are you sure !");
    console.log(result);
    if (result === true) {
      const todo_desc = doc(db, "todos-desc", id);
      await deleteDoc(todo_desc);
      
      getTodos();
      getTodos_desc();
    }
  };

  const showUpdateForm = (title, id) => {
    setUpdate(true)
    setAdd(false)
    setTitle(title);
    setId(id)
  }

  const sign_in = () => {

    signInWithPopup(auth, provider).then((data) => {
      setEmail(data.user.email)
      setUser_img(data.user.photoURL)
      setUser_name(data.user.displayName)
      sessionStorage.setItem("email", data.user.email)
      sessionStorage.setItem("img", data.user.photoURL)
      sessionStorage.setItem("name", data.user.displayName)
      setAdd(false)
      setAuth_alert(false)
      window.location.replace('/')
    })

  }
  const sign_out = () => {
    sessionStorage.setItem("email", '')
    sessionStorage.setItem("img", '')
    sessionStorage.setItem("name", '')
    window.location.replace('/')
  }
  const check_auth = () => {
    if (email === "" || email === null) {
      setAuth_alert(true);
      return;
    }
  }



  useEffect(() => {
    setEmail(sessionStorage.getItem("email"))
    setUser_img(sessionStorage.getItem("img"))
    setUser_name(sessionStorage.getItem("name"))

    getTodos();
    getTodos_desc();

    setYear(new Date().getFullYear());
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="App h-screen bg-[#FFF2F2]">
      <nav className='flex justify-between items-center py-3 border-b-[1px] md:mx-44 mx-5'>
        <div className='flex justify-center items-center gap-4 '>
          <h1 className='text-2xl font-bold py-5 text-[#7286D3]'>My Todo's List</h1>
          <FcTodoList size={50} />

        </div>
        {!email && <button type="button" onClick={sign_in} className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
          <svg className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
          Sign in with Google
        </button>}

        {email &&
          <div>
            <img id="avatarButton" type="button" data-dropdown-toggle="userDropdown" data-dropdown-placement="bottom-start" className="w-10 h-10 rounded-full cursor-pointer"
              src={user_img} alt="User dropdown" />


            <div id="userDropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 text-left">
              <div className="px-4 py-3 text-sm text-gray-900">
                <div>{user_name}</div>
                <div className="font-medium truncate">{email}</div>
              </div>
              <div className="py-1 ">
                <button className="block px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100" onClick={() => { sign_out() }}>Sign out</button>
              </div>
            </div>
          </div>

        }
      </nav>


      {add && email &&
        <div className='flex flex-col justify-center items-center bg-[#8EA7E9] w-[60%] py-4 rounded-md mx-auto relative shadow-xl'>

          <h1 className='py-4 font-bold text-white'>Add New Todo</h1>
          <IoMdCloseCircleOutline size={30} className='text-red-600 hover:text-red-400 cursor-pointer absolute top-1 right-1 hover:scale-150 ease-in-out duration-500' onClick={() => { setAdd(false) }} />
          <input className='my-2 px-4 py-1 rounded-md border border-black' type="text" onChange={(event) => { setTitle(event.target.value) }} name="title" id="title" placeholder='title...' />
          <button className=' rounded-md px-2 bg-[#CDE990] text-[#7286D3] shadow-md' onClick={addTodo}>add Todo</button>
        </div>
      }

      {update && email &&
        <div className='flex flex-col justify-center items-center  bg-[#8EA7E9] w-[60%] py-4 rounded-md mx-auto relative shadow-xl'>

          <h1 className='py-4 font-bold text-white'>Update Todo</h1>
          <IoMdCloseCircleOutline size={30} className='text-red-600 hover:text-red-400 cursor-pointer absolute top-1 right-1 hover:scale-150 ease-in-out duration-500' onClick={() => { setUpdate(false) }} />

          <input className='my-2 px-4 py-1 rounded-md border border-black shadow-md' type="text" value={title} onChange={(event) => { setTitle(event.target.value) }} name="title" id="title" placeholder='title...' />
          <button className=' rounded-md px-2 bg-[#FFEA20] text-[#7286D3] shadow-lg' onClick={() => updateTodo(id, title)}>update Todo</button>

        </div>
      }

      {alert && <div className="flex justify-between py-2 px-8 rounded-lg mx-auto mt-3 bg-[#fad2e1]  text-[#7c193d] w-[360px] md:w-[50%] hover:scale-110 ease-in-out duration-500 hover:text-red-400">
        <p className="font-sans text-2xl">Pleas Fill The Information !</p>
        <button className="font-bold" onClick={() => { setAlert(false) }}>&#10005;</button>
      </div>}

      {auth_alert && <div className="flex justify-between py-2 px-8 rounded-lg mx-auto mt-3 bg-[#fad2e1]  text-[#7c193d] w-[360px] md:w-[50%] hover:scale-110 ease-in-out duration-500 hover:text-red-400">
        <p className="font-sans text-2xl">Pleas SignIn To Continue !</p>
        <button className="font-bold" onClick={() => { setAuth_alert(false) }}>&#10005;</button>
      </div>}


      <div className='mx-auto mt-4 lg:w-[90%] md:w-[60%] w-[90%] rounded-lg bg-[#E5E0FF] grid lg:grid-cols-3  md:grid-cols-1 gap-4 shadow-2xl'>

        {!todos &&
          <>
            <Loading />
            <Loading />
            <Loading />
          </>
        }
        {email && todos.map((todo) => {
          return <div key={todo.id} className="bg-[#8EA7E9] text-white m-6 rounded-md flex flex-col justify-around shadow-xl">
            <div className='flex justify-between'>
              <FaPen className='text-[#FFEA20] hover:text-yellow-400 m-2 cursor-pointer hover:scale-150 ease-in-out duration-500' size={20} onClick={() => showUpdateForm(todo.title, todo.id)} />
              <h1 className='text-3xl font-semibold'>{todo.title}</h1>
              <FaTrashAlt className='text-red-500 hover:text-red-400 m-2 cursor-pointer hover:scale-150 ease-in-out duration-500' size={20} onClick={() => deleteTodo(todo.id)} />
            </div>

            <div className='flex flex-col justify-center gap-2 py-2'>

              {todo_desc.filter((x) => { return x.todo_id === todo.id }).map((todo_desc) => {
                return <div className="checkbox-wrapper-15 flex justify-between items-center gap-3 mx-8 p-2 bg-[#7286D3] shadow-lg rounded-md" key={todo_desc.description}>
                  {!todo_desc.check ? <input className="my-checkbox-x2 ml-2" id="cbx-15" type="checkbox" onClick={(e) => { submitCheck(todo_desc.id, e.target.checked) }} />
                    :
                    <input className="my-checkbox-x2 ml-2" id="cbx-15" defaultChecked type="checkbox" onClick={(e) => { submitCheck(todo_desc.id, e.target.checked) }} />
                  }

                  <span>{todo_desc.description}</span>


                  <div className='flex justify-center'>
                    <FaTrashAlt className='text-red-500 hover:text-red-400 m-2 cursor-pointer hover:scale-150 ease-in-out duration-500' size={20} onClick={() => deleteTodoTask(todo_desc.id)} />
                  </div>
                </div>

              })}
              {addDesc &&
                <div className='flex justify-center items-center gap-3'>
                  <input className='my-2 px-4 py-1 rounded-md border border-black w-52 text-center text-black' type="text" value={description} onChange={(event) => { setDescription(event.target.value) }} name="Task" id="Task" placeholder='Task...' />
                  <BiAddToQueue size={25} className='cursor-pointer' onClick={() => addTodoTask(todo.id)} />
                </div>
              }

            </div>



            {!addDesc &&<div className='flex justify-center'>
              <button className=' rounded-md px-2 bg-[#CDE990] text-[#7286D3] m-4 shadow-lg hover:scale-110 ease-in-out duration-500' onClick={() => { setAddDesc(!addDesc) }}>add Task</button>
            </div>}

          </div>

        })}

        <div className="bg-[#8EA7E9] text-white m-6 rounded-md w-40 h-32 flex justify-center items-center cursor-pointer shadow-xl hover:scale-110 ease-in-out duration-500"
          onClick={() => { check_auth(); setAdd(!add); setUpdate(false) }}>
          <BiAddToQueue size={80} />
        </div>

      </div>

      <footer className="py-3 bg-[#7286D3] bottom-0 w-full absolute">
        <div className="">
          <p className="m-0 text-center text-white flex justify-center items-center gap-3">
            <span>Created By</span>
            <a href="https://abdo-dev.vercel.app" rel="noreferrer" target="_blank" className='text-teal-400 hover:scale-110 ease-in-out duration-500'>ABDO_DEV</a>
            <span>&copy; ToDo App {year}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
