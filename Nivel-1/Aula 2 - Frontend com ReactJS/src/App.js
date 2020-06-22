import React, { useState, useEffect } from 'react';
import api from './services/api';

import Header from './components/Header';

import './App.css';

import backgroundImg from './assets/background.jpg';


function App(){
  const [ projects , setProjects ] = useState([]);

  useEffect( () => {
    api.get('projects').then( response => {
      setProjects(response.data);
    })
  }, []);

  async function handleAddProject(){
    // setProjects([...projects, `Novo Projeto ${Date.now()}`]);
    const response = await api.post('projects', {
      title: `Novo Projeto ${Date.now()}`,
      owner: 'Rom',
    });

    const project = response.data;

    setProjects([...projects, project]);
  }

  return (
      <>
        <img width={120} src={backgroundImg} />
        <h1>Hellow</h1>
        <Header title={'Projects'} />

        <ul>
          { projects.map( proj => (
            <li key={proj.id}>{proj.title}</li>
          ))}
        </ul>

        <button type="button" onClick={handleAddProject}>Adicionar projeto</button>
      </>
    )
}

export default App;