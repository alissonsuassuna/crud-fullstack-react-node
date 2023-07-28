import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });
  const [clienteEditData, setClienteEditData] = useState(null); // Estado para armazenar os dados do cliente sendo editado

  useEffect(() => {
    fetchClientes();
  }, []);

  //Lista os clientes
  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  // Ver cada modificação
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (clienteEditData) {
        // Editar o cliente existente
        await axios.put(`http://localhost:4000/${clienteEditData.id}`, formData);
        setClienteEditData(null); // Limpar o clienteEditData após a edição
      } else {
        // Adicionar novo cliente
        await axios.post('http://localhost:4000/', formData);
      }
      setFormData({ nome: '', email: '', telefone: '' });
      fetchClientes();
    } catch (error) {
      console.error('Erro ao criar ou editar cliente:', error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/${id}`);
      setClienteEditData(response.data); // Armazenar os dados do cliente a ser editado
      // Preencher o formulário com os dados do cliente
      setFormData({
        nome: response.data.nome,
        email: response.data.email,
        telefone: response.data.telefone,
      });
    } catch (error) {
      console.error('Erro ao buscar cliente para edição:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/${id}`);
      fetchClientes();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  return (
    <div>
      <h1>Clientes</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="text"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="Telefone"
        />
        <button type="submit">{clienteEditData ? 'Salvar Edição' : 'Adicionar Cliente'}</button>
      </form>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            {cliente.nome} - {cliente.email} - {cliente.telefone}
            <button onClick={() => handleEdit(cliente.id)}>Editar</button>
            <button onClick={() => handleDelete(cliente.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
