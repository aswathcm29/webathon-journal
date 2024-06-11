/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaWandMagicSparkles } from "react-icons/fa6";

const AddJournals = () => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState(null); // Use null for initial state
  const [data, setData] = useState([]);
  const [generated, setGenerated] = useState('');
  const [_id, setId] = useState('');

  function getCookieValue(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }

  const fetchOldData = async () => {
    const token = getCookieValue('journal_token');
    try {
      const data = await axios.post(`${import.meta.env.VITE_BASE_URL}journal/getJournalbyId`, {
        id: id
      },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      setId(_id);
      setTitle(data.data.message.title);
      setAuthor(data.data.message.author);
      setImage(data.data.message.image);
      console.log('image',image)
      setDescription(data.data.message.description);
      setJournalContent(data.data.message.journalContent);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOldData();
    }
  }, [id]);

  const extractGen = (content) => {
    const cleanedContent = content.replace(/\n/g, '').replace(/\*/g, '');
    const sentences = cleanedContent.split(/[.!?]+/);
    sentences.shift();
    sentences.pop();
    const modifiedContent = sentences.join('. ');

    return modifiedContent;
  };

  const handleGenerate = async () => {
    if (!title) {
      return toast.error('Enter Title');
    }
    const token = getCookieValue('journal_token');
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}journal/generateblog`, {
        data: title
      },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      const content = extractGen(res.data.message);
      setJournalContent(content); // Set the generated content directly
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const token = getCookieValue('journal_token');

      if (!title || !description || !journalContent || !author) {
        toast.error('Fill all the details');
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}journal/uploads`, {
        id,
        title,
        description,
        journalContent,
        author,
        image,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });

      if (response.status === 200) {
        navigate('/home');
        setJournalContent('');
      }
    } catch (err) {
      console.log(err.message)
      toast.error("Incomplete data");
    }
  };

  function handleFileChange(e) {
    setImage(e.target.files[0]); 
    const fileNameSpan = document.getElementById('file-name');
    const file = e.target.files[0];
    if (file) {
      fileNameSpan.textContent = file.name;
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileChange({ target: { files } });
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <div className='p-4 '>
      <div className='flex items-center flex-col'>
        <div className='text-4xl p-4'>Showcase Your Journals</div>
        <div className='flex flex-col gap-y-[2rem] w-[80%] mt-[1rem] items-center '>
          <div className='relative w-full sm:w-[70%]'>
            <input type='text' className='peer h-10 border-solid w-full border-b-2 border-gray-800 text-black bg-transparent placeholder-transparent focus:outline-none focus:border-gray-800' placeholder=''
              value={title} name='title' onChange={(e) => { setTitle(e.target.value) }} required
            />
            <label className="absolute left-0 -top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-green-400 peer-focus:text-sm">Title</label>
          </div>
          <div className='relative w-full sm:w-[70%]'>
            <textarea type='text' className='peer h-10 border-solid w-full border-b-2 border-gray-800 text-black bg-transparent placeholder-transparent focus:outline-none focus:border-gray-800' placeholder=''
              value={description} name='description' onChange={(e) => { setDescription(e.target.value) }} required
            />
            <label className="absolute left-0 -top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-green-400 peer-focus:text-sm">Description</label>

          </div>
          <div className='w-full sm:w-[70%] flex flex-col items-start gap-4 text-lg m-2'>
            <div className='flex justify-between w-full items-center'>
              <button onClick={handleGenerate} className='flex items-center gap-x-[0.5rem] bg-green-400 p-[0.5rem] rounded-md '>
                <span className='text-sm'>Generate using AI</span>
                <FaWandMagicSparkles />
              </button>
            </div>
            <ReactQuill
              modules={modules}
              formats={formats}
              name='journalContent'
              placeholder='Write your Journal Content here...'
              className='w-full p-2 border-2 border-gray-300 bg-white rounded-lg h-30'
              value={journalContent} onChange={(e) => { setJournalContent(e) }}
              required
            />
          </div>
          <div className='flex w-full sm:w-[70%] flex-col sm:flex-row'>
            <div className='relative w-full sm:w-[50%] flex flex-col items-start gap-4 text-lg m-2'>
              <input type='text' className='peer h-10 border-solid w-full border-b-2 border-gray-800 text-black bg-transparent placeholder-transparent focus:outline-none focus:border-gray-800' placeholder='' required
                value={author} name='author' onChange={(e) => { setAuthor(e.target.value) }}
              />
              <label className="absolute left-0 -top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-green-400 peer-focus:text-sm">Author</label>
            </div>
            <div 
                className='relative w-full sm:w-[50%] flex flex-col items-start gap-4 text-lg m-2'
                onDrop={(e) => handleDrop(e)}
                onDragOver={(e) => handleDragOver(e)}
              >
                <input 
                  className='peer h-10 border-solid w-full border-b-2 border-gray-800 text-black bg-transparent placeholder-transparent focus:outline-none focus:border-gray-800 opacity-0 absolute inset-0 cursor-pointer'
                  placeholder=''
                  type='file'
                  name='image'
                  onChange={(e) => handleFileChange(e)}
                />
                <div 
                  className='w-full h-20 border-2 border-dashed border-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100'
                 value={image} onClick={() => document.querySelector('input[name="image"]').click()}
                >
                  <label className="absolute left-0 -top-8 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-green-400 peer-focus:text-sm">
                    Upload Image
                  </label>
                  <span id="file-name" className="text-gray-500">Drop or Upload your image</span>
                </div>
              </div>
          </div>
          <button className='bg-green-400 px-3 py-3 rounded-lg mt-7 text-2xl shadow-xl' onClick={handleSubmit}>Add Post</button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddJournals;
