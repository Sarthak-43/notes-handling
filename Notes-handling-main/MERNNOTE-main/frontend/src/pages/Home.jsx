import React, { useContext, useState } from 'react'
import Nav from '../components/Nav'
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { authDatacontext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import { useEffect } from 'react';
import { useRef } from 'react';
import {io} from 'socket.io-client'

function Home() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socket = useRef(null);
  const [notes,setnotes] = useState([])
  let {userData,setuserData,notesData,setnotesData,getnotes} = useContext(userDataContext);
  const [newnote,setnewnote] = useState({
    id:"",
    title: "",
    content: "",
    file:null,
    fileUrl: ""
  })
  const [showForm, setShowForm] = useState(false);
  let {serverURL} = useContext(authDatacontext)
  const [showChat,setshowChat] = useState(false)

  useEffect(() => {
    if (userData ) {
      console.log("Fetching notes for user:", userData);
      getnotes();
    }
  }, [userData]);

  useEffect(() => {
  console.log("Fetched notesData:", notesData); // 👈 Check if fileUrl is present
}, [notesData])
 
  const handlechange = async (e) => {
    e.preventDefault();
    try {
      if (newnote.title || newnote.content) {
        const formData = new FormData();
        formData.append('title', newnote.title);
        formData.append('content', newnote.content);
        formData.append('file', newnote.file);
        let result = await axios.post(serverURL +"/api/notes/upload", formData, {withCredentials:true})
        console.log(result.data)
        const savedNote = result.data.result;
        setnotes([...notes, savedNote])
        setnotesData(prev=>[...prev, savedNote])
        setnewnote({ title: "", content: "", file: null, _id: "", fileUrl: "" });
        setShowForm(false);
        console.log("Note added successfully:", result.data);
      }
      else {
        alert("Please fill fields");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }
  
  

   async function handleDelete(noteId) {
    try {
      if (!noteId) {
        console.log( "Note ID is required for deletion");
        return;
      }
      let res = await axios.delete(serverURL+`/api/notes/delete/${noteId}`,{withCredentials:true})
      setnotesData(prev => prev.filter(note => note._id !== noteId));
      setnotes(prev => prev.filter(note => note._id !== noteId));
      setShowForm(false);
      setnewnote({ title: "", content: "", file: null, _id: "", fileUrl: "" });
      console.log("Note deleted successfully:", res.data);
    } 
    catch (error) {
      console.error("Error deleting note:", error);
    }
    
   }
   
   async function updateNote(e,noteId,note)
   {
    e.preventDefault();
    if (!noteId || !note.title || !note.content) {
      alert("Please fill all fields");
      return;
    }
    try {
        const formData = new FormData();
        formData.append('title', note.title);
        formData.append('content',note.content);
        if (note.file) 
        formData.append('file', note.file);
        let result = await axios.put(serverURL+`/api/notes/update/${noteId}`,
        formData,{withCredentials:true});
        const updatedNote = result.data.updatedNote;
        console.log("Note updated:", updatedNote);

        setnotesData(prev => prev.map(n => n._id === noteId ? updatedNote : n));
        setnotes(prev => prev.map(n => n._id === noteId ? updatedNote : n));
        setShowForm(false);
        setnewnote({ title: "", content: "", file: null, _id: "", fileUrl: "" });
        console.log("Note updated successfully:", result.data);
    } 
    catch (error) {
      console.error("Error updating note:", error);
    }
   }

  useEffect(() => {
  
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${serverURL}/api/chat/`, {
        withCredentials: true,
      });
      setMessages(res.data); // Load old messages
    } catch (error) {
      console.error("Failed to load messages:", error.message);
    }
  };

  fetchMessages(); 

  
  socket.current = io(serverURL, { withCredentials: true });

  
  socket.current.on("receive-message", (message) => {
    console.log("Received message:", message); // Optional: for debugging
    setMessages((prev) => [...prev, message]);
  });
  return () => {
    socket.current.disconnect();
  };
}, []);

const sendMessage = () => {
  if (messageInput.trim() === "") return;

  const message = {
    sender: userData?.UserName || "Anonymous",
    text: messageInput,
    timestamp: new Date().toISOString(),
    userId: userData?._id,
  };

  socket.current.emit("send-message", message);
  setMessageInput(""); // Clear input immediately
};

    const toggleChat = () => setshowChat(prev => !prev);

  return (
    <div className="w-full min-h-[100vh] bg-[#f3edd2]">
      <Nav toggleChat={toggleChat}/>
      <div className="flex flex-col w-full lg:flex-row items-start justify-center gap-[20px] px-[20px] pt-[40px] ">
        <div className="w-full h-[200px] lg:w-[30%] lg:h-[500px] min-h-[500px] bg-white shadow-lg rounded-lg flex flex-col items-center justify-start px-[30px] py-[20px] gap-[20px]">
          <div className='w-full flex flex-col items-start justify-center'>
          <h1 className="text-[30px] font-bold text-[#333]">Notes</h1>
          </div>
          <div className='w-full flex flex-col items-start justify-center'>
            <div className='w-full flex items-center bg-blue-900 text-white rounded-lg px-[10px] py-[5px] gap-[10px] h-[40px]'>
              <button className='w-full border-none outline-none text-[23px]' onClick={()=>{setShowForm(true); setnewnote({ title: "", content: "",file:null,fileUrl:""})}}>+ New Notes</button>
            </div> 
          </div>
          <div className='w-full flex flex-col gap-2 mt-4 overflow-y-auto max-h-[300px] scrollbar-hide'>
         {notesData.length>0 &&  <div className='w-full flex flex-col gap-2 mt-4'>
            {notesData.map((note, idx) => (
              <div key={note._id || idx} className="text-lg text-blue-900 font-semibold bg-blue-100 rounded px-2 py-1 flex items-center justify-between cursor-pointer" onClick={() => { setShowForm(true); setnewnote({
                _id: note._id,
                title: note.title,
                content: note.content,
                fileUrl: note.fileUrl,
                file: null
                });
               }}>
                {note.title}
                 <button
                   className='text-blue-900 hover:text-red-600'
                   onClick={(e) => {
                     e.stopPropagation();
                     handleDelete(note._id);
                   }}
                   aria-label="Delete note"
                 >
                    <RxCross2 size={20} />
                  </button>
              </div>
            ))}
          </div> }
          </div>
        </div>

        <div className="w-full h-[400px] lg:w-[40%] lg:h-[500px] min-h-[500px] bg-white shadow-lg rounded-lg flex flex-col items-center justify-center px-[30px] py-[50px]">
          {/* Middle content */}
          {showForm && (
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={(e)=>{
                newnote._id?updateNote(e,newnote._id,newnote):handlechange(e)}}>
              <input
                type="text"
                placeholder="Title"
                className="border rounded px-3 py-2 text-lg"
                value={newnote.title}
                onChange={e => setnewnote({ ...newnote, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="border rounded px-3 py-2 text-base min-h-[100px] resize-none"
                value={newnote.content}
                onChange={e => setnewnote({ ...newnote, content: e.target.value })}
                required
              />
              {/* Show PDF preview if fileUrl exists */}
              {newnote.fileUrl && (
              <div className="w-full flex items-center justify-between">
              {/* Download Link */}
              <a
               href={newnote.fileUrl.replace('/upload/', '/upload/fl_attachment/')}
              download="NoteAttachment.pdf"
              className="text-green-700 underline text-sm w-fit"
            >
              Download attached PDF
            </a>

            {/* Preview Link */}
            <a href={newnote.fileUrl} target="_blank" rel="noopener noreferrer"
            className="text-blue-700 underline text-sm w-fit">
              Preview attached PDF
            </a>
            </div>)}

              {/* File input to add new PDF */}
            <input
            type="file"
            accept='application/pdf'
            className="border rounded px-3 py-2 text-base"
            onChange={e => setnewnote({ ...newnote, file: e.target.files[0] })}
          />

              <button
                type="submit"
                className="bg-blue-900 text-white rounded px-4 py-2 font-semibold hover:bg-blue-800 transition">
                Save
              </button>
            </form>
          )}
        </div>
        <div className="hidden lg:flex lg:w-[30%] lg:h-[500px] min-h-[500px] bg-white shadow-lg rounded-lg flex-col px-4 py-4">
  <h2 className="text-xl font-bold text-blue-900 mb-2">Chat</h2>
   
  <div className="flex-1 overflow-y-auto mb-2 border p-2 rounded bg-gray-50 scrollbar-hide">
    {messages.map((msg, idx) => (
      <div key={idx} className="mb-2">
        <span className="font-semibold text-blue-700">{msg?.author?.UserName||msg.sender}:</span>
        <span className="ml-2">{msg.text}</span>
      </div>
    ))}
  </div>
  <div className="flex gap-2">
    <input
      type="text"
      placeholder="Type a message"
      className="flex-1 border rounded px-3 py-1"
      value={messageInput}
      onChange={e => setMessageInput(e.target.value)}
    />
    <button
      className="bg-blue-900 text-white px-3 py-1 rounded"
      onClick={sendMessage}
    >
      Send
    </button>
  </div>
</div>

      </div>

       {showChat && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center lg:hidden">
          <div className="bg-white w-[90%] h-[80%] rounded-lg shadow-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-blue-900">Chat</h2>
              <button onClick={toggleChat} className="text-red-500 font-bold text-lg">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto mb-2 border p-2 rounded bg-gray-50 scrollbar-hide">
              {messages.map((msg, idx) => (
                <div key={idx} className="mb-2">
                  <span className="font-semibold text-blue-700">{msg?.author?.UserName || msg.sender}:</span>
                  <span className="ml-2">{msg.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Type a message" className="flex-1 border rounded px-3 py-1"
                value={messageInput} onChange={e => setMessageInput(e.target.value)} />
              <button className="bg-blue-900 text-white px-3 py-1 rounded" onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Home