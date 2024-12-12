import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'https://api.escuelajs.co/api/v1/categories';

const App = () => {
  const [categorias, setCategorias] = useState([]);
  const [datosFormulario, setDatosFormulario] = useState({ nombre: '', imagen: '' });
  const [idEdicion, setIdEdicion] = useState(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const respuesta = await axios.get(API_URL);
      setCategorias(respuesta.data);
    } catch (error) {
      toast.error('Error al cargar las categorías');
    }
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setDatosFormulario({ ...datosFormulario, [name]: value });
  };

  const manejarEnvioFormulario = async (e) => {
    e.preventDefault();
    const { nombre, imagen } = datosFormulario;

    if (!nombre || !imagen) {
      toast.warn('Todos los campos son obligatorios');
      return;
    }

    try {
      if (idEdicion) {
        await axios.put(`${API_URL}/${idEdicion}`, { name: nombre, image: imagen });
        toast.success('Categoría actualizada correctamente');
      } else {
        await axios.post(API_URL, { name: nombre, image: imagen });
        toast.success('Categoría creada correctamente');
      }
      cargarCategorias();
      resetFormulario();
    } catch (error) {
      toast.error('Error al guardar la categoría');
    }
  };

  const manejarEdicion = (categoria) => {
    setDatosFormulario({ nombre: categoria.name, imagen: categoria.image });
    setIdEdicion(categoria.id);
  };

  const manejarEliminacion = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta categoría?')) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Categoría eliminada correctamente');
      cargarCategorias();
    } catch (error) {
      toast.error('Error al eliminar la categoría');
    }
  };

  const resetFormulario = () => {
    setDatosFormulario({ nombre: '', imagen: '' });
    setIdEdicion(null);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">CRUD de Categorías</h1>

      <form onSubmit={manejarEnvioFormulario} className="mb-4 bg-light p-4 rounded shadow">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="form-control"
            value={datosFormulario.nombre}
            onChange={manejarCambioInput}
            placeholder="Ingresa el nombre de la categoría"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="imagen" className="form-label">URL de Imagen</label>
          <input
            type="url"
            id="imagen"
            name="imagen"
            className="form-control"
            value={datosFormulario.imagen}
            onChange={manejarCambioInput}
            placeholder="Ingresa la URL de la imagen"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">
          {idEdicion ? 'Actualizar' : 'Crear'}
        </button>
        {idEdicion && <button type="button" className="btn btn-secondary" onClick={resetFormulario}>Cancelar</button>}
      </form>

      <h2 className="mb-4">Lista de Categorías</h2>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td>{categoria.id}</td>
              <td>{categoria.name}</td>
              <td><img src={categoria.image} alt={categoria.name} width="50" /></td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => manejarEdicion(categoria)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => manejarEliminacion(categoria.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
};

export default App;
