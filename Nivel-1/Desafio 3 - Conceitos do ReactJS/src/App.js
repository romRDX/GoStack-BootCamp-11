import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [ repositories, setRepositories ] = useState([]);

  useEffect(() => {
    api.get('repositories').then( response => {
      setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository() {
    const resp = await api.post('repositories', {
      title: `Novo Repositorio ${Date.now()}`,
      url: 'url-teste',
      techs: [ 'TesteTechs', 'TechsTeste']
    });

    const repo = resp.data;
    setRepositories([...repositories, repo]);
  }

  async function handleRemoveRepository(id) {
    const resp = await api.delete(`repositories/${id}`);

    if(resp.status === 204){
      const repo = repositories.filter( repo => repo.id !== id );
      setRepositories(repo);
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {
          repositories.map( repo => (
            <li key={repo.id} >
              {repo.title}
              <button type="button" onClick={() => handleRemoveRepository(repo.id)}>Remover</button>
            </li>
          ))
        }
      </ul>

      <button type="button" onClick={handleAddRepository}>Adicionar</button>
        <br />
        <br />
      <button type="button" onClick={ () => console.log('REPO: ',repositories) }>REPO</button>
    </div>
  );
}

export default App;

// <li>
//           Repositório 1

//           <button onClick={() => handleRemoveRepository(1)}>
//             Remover
//           </button>
//         </li>