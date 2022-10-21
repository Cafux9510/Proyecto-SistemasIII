import React from "react";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import "../estilos/estilos.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid container_nav">
        <Link className="navbar-brand link" to="/">
          Colegio Vespucio
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link link" aria-current="page" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link link" to="/comprobantes">
                Comprobantes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link link" to="/insumos">
                Insumos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link link" to="/pagos">
                Pagos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link link" to="/TablaProveedores">
                Proveedores
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link link" to="/AsignacionPersonal">
                Asignación del Personal
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link link" to="/Alumnos">
                Alumnos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link link" to="/PersonalEducativo">
                Personal Educativo
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link link" to="/Materias">
                Materias
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link link" to="/EstructuraEscolar">
                Materias
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
