// citas.js
import { guardarCitas, obtenerCitas } from './datos.js';

let citasBarberia = obtenerCitas();

function mostrarCitas() {
    const listaCitas = document.getElementById('listaCitas');
    listaCitas.innerHTML = '';

    if (citasBarberia.length === 0) {
        const item = document.createElement('li');
        item.textContent = 'No hay citas agendadas.';
        listaCitas.appendChild(item);
    } else {
        citasBarberia.forEach((cita, index) => {
            const item = document.createElement('li');
            item.textContent = `Cliente: ${cita.nombreCliente}, Día: ${cita.fecha}, Hora: ${cita.hora}, Profesionales: ${cita.profesionales.join(', ')}, Servicios: ${cita.servicios.join(', ')}`;
            
            const botonBorrar = document.createElement('button');
            botonBorrar.textContent = 'Borrar';
            botonBorrar.addEventListener('click', () => eliminarCita(index));

            const botonEditar = document.createElement('button');
            botonEditar.textContent = 'Editar';
            botonEditar.addEventListener('click', () => editarCita(index));

            item.appendChild(botonBorrar);
            item.appendChild(botonEditar);
            listaCitas.appendChild(item);
        });
    }

    guardarCitas(citasBarberia);
}

function editarCita(index) {
    const cita = citasBarberia[index];

  
    document.getElementById('nombreCliente').value = cita.nombreCliente;
    document.getElementById('fechaCita').value = cita.fecha;
    document.getElementById('horaCita').value = cita.hora;

    const checkboxesServicios = document.querySelectorAll('#servicios input[type="checkbox"]');
    checkboxesServicios.forEach(checkbox => {
        checkbox.checked = cita.servicios.includes(checkbox.value);
    });



    const citaEliminada = citasBarberia.splice(index, 1)[0];
    guardarCitas(citasBarberia);

    const form = document.getElementById('citaForm');
    form.onsubmit = function(event) {
        event.preventDefault();
        
        const nombreCliente = document.getElementById('nombreCliente').value;
        const fecha = document.getElementById('fechaCita').value;
        const hora = document.getElementById('horaCita').value;

   
        const checkboxesServicios = document.querySelectorAll('#servicios input[type="checkbox"]:checked');
        const seleccionadosServicios = Array.from(checkboxesServicios).map(checkbox => checkbox.value);

   
        try {
            if (!nombreCliente || !fecha || !hora || seleccionadosServicios.length === 0) {
                throw new Error('Por favor, completa todos los campos.');
            }

       
            const citaExistente = citasBarberia.some(cita => cita.fecha === fecha && cita.hora === hora && cita.profesionales.includes(citaEliminada.profesional));
            if (citaExistente) {
                throw new Error('Ya hay una cita reservada en esa fecha y hora con uno de los profesionales seleccionados.');
            }

      
            citasBarberia.push({ nombreCliente, fecha, hora, profesional: citaEliminada.profesional, servicios: seleccionadosServicios });
            mostrarCitas();
            form.reset();
            checkboxesServicios.forEach(checkbox => checkbox.checked = false);

            
            form.onsubmit = agregarCita;
        } catch (error) {
            console.error(error.message);
        }
    };
}



function agregarCita(event) {
    event.preventDefault();

    const nombreCliente = document.getElementById('nombreCliente').value;
    const fecha = document.getElementById('fechaCita').value;
    const hora = document.getElementById('horaCita').value;
    const profesionalesSelect = document.getElementById('profesional');
    const seleccionadosProfesionales = Array.from(profesionalesSelect.selectedOptions).map(option => option.value); // Obtener todos los valores seleccionados

   
    const checkboxesServicios = document.querySelectorAll('#servicios input[type="checkbox"]:checked');
    const seleccionadosServicios = Array.from(checkboxesServicios).map(checkbox => checkbox.value); // Obtener todos los servicios seleccionados

    try {
        if (!nombreCliente || !fecha || !hora || seleccionadosProfesionales.length === 0 || seleccionadosServicios.length === 0) {
            throw new Error('Por favor, completa todos los campos.');
        }

        
        const citaExistente = seleccionadosProfesionales.some(profesional => 
            citasBarberia.some(cita => cita.fecha === fecha && cita.hora === hora && cita.profesionales.includes(profesional))
        );

        if (citaExistente) {
            throw new Error('Ya hay una cita reservada en esa fecha y hora con uno de los profesionales seleccionados.');
        }

        citasBarberia.push({ nombreCliente, fecha, hora, profesionales: seleccionadosProfesionales, servicios: seleccionadosServicios });
        mostrarCitas();

        document.getElementById('citaForm').reset();
        // Desmarcar todos los checkboxes
        checkboxesServicios.forEach(checkbox => checkbox.checked = false);
    } catch (error) {
        console.error(error.message);
    } finally {
        console.log('Proceso de agregar cita finalizado.');
    }
}



function eliminarCita(index) {
    citasBarberia.splice(index, 1);
    mostrarCitas();
}

document.getElementById('citaForm').addEventListener('submit', agregarCita);
mostrarCitas();

