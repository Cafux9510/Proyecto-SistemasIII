import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import "../estilos/gestionMateriaXProfesor.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Backend/client";
import styled from "@emotion/styled";

const Contenedor = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GestionMateriasProfesor = () => {
  const [materia, setMateria] = useState({
    id_cargo: "",
    nombre_materia: "",
    id_anio: "",
  });

  const [materiasProfe, setMateriasProfe] = useState("");

  const navigate = useNavigate();

  const materiasAsignados = async () => {
    try {
      let idDelStorage = localStorage.getItem("idUsuario");

      const materias = await supabase
        .from("materiasProfesView")
        .select(
          `
                id_cargo,
                id_materia,
                nombre_materia,
                concatenado,
                id_anio
            `
        )
        .eq("id_personal", idDelStorage);

      setMateriasProfe(materias.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const buscarMateria = async(mate) => {
  //     const dato = await supabase.from("cargoFuncion")
  //             .select(`
  //                 materias(
  //                     id_materia,
  //                     nombre_materia,
  //                     id_grado
  //                 )
  //             `)
  //         .eq("id_cargo", mate.id_cargo)

  //     return dato.data[0].materias
  // }

  async function boton() {
    const carg = await supabase
      .from("materiasProfesView")
      .select(
        `
                id_cargo,
                id_materia,
                id_anio
            `
      )
      .eq("id_cargo", materia.id_cargo);

    localStorage.setItem("idMateria", carg.data[0].id_materia);
    localStorage.setItem("idAnio", carg.data[0].id_anio);
    navigate("/MateriaXProfesor");
  }

  const actualizarState = (e) => {
    setMateria({
      ...materia,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    materiasAsignados();
  }, []);

  return (
    <div className="grid grid-nogutter text-800 contenedorGestion">
      <Contenedor>
        <div className="md:col-6 p-6 text-center md:text-left flex align-items-center ">
          <section>
            <span className="block text-6xl font-bold mb-1 spanTituloGestion">
              Gestione sus Materias
            </span>
            <div className="text-4xl font-bold mb-3 subtituloGestion">
              Seleccione la Materia
            </div>

            <Dropdown
              name="id_cargo"
              className="w-12 border-500"
              optionValue="id_cargo"
              onChange={actualizarState}
              value={materia.id_cargo || ""}
              optionLabel="concatenado"
              placeholder="Seleccione Materia"
              options={materiasProfe}
            />

            <br />
            <br />
            <Button
              label="Seleccionar"
              onClick={boton}
              type="button"
              className="mr-3 p-button-raised botonSubmitGestion"
            />
          </section>
        </div>
      </Contenedor>
      <div className="md:col-6 overflow-hidden">
        <img
          src="https://cdn.pixabay.com/photo/2014/03/12/18/45/boys-286245_960_720.jpg"
          alt="hero-1"
          className="md:ml-auto block md:h-full"
        />
      </div>
    </div>
  );
};
