import React, { useState, useEffect } from 'react';
import { TouchableOpacity, SafeAreaView, FlatList, Text, StyleSheet, StatusBar } from 'react-native';

import api from './services/api';

export default function App(){
  const [ projects, setProjects ] = useState([]);

  useEffect( () => {
    api.get('projects').then( response => {
      setProjects(response.data);
    });
  }, []);

  async function handleAddProject(){
    const response = await api.post('projects', {
      title: `Data: ${Date.now()}`,
      owner: 'Diego Fernandes',
    });

    const project = response.data;
    setProjects([...projects, project]);
  }

  return ( 
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />

      <SafeAreaView style={styles.container}>
        <FlatList
          data={projects}
          keyExtractor={ proj => proj.id}
          renderItem={ ({ item }) => (
            <Text style={styles.project}>{item.title}</Text>
          )}
        />

        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.button}
          onPress={handleAddProject}
        >
            <Text style={styles.buttonText}>Adicionar Projeto</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>//
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
  },

  project: {
    color: '#FFF',
    fontSize: 20,
  },

  title: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#FFF',
    margin: 20,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  }
});