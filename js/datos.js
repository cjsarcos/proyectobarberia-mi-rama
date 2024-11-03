// datos.js
export function guardarCitas(citas) {
    localStorage.setItem('citasBarberia', JSON.stringify(citas));
}

export function obtenerCitas() {
    return JSON.parse(localStorage.getItem('citasBarberia')) || [];
}

export async function cargarProfesionales() {
    try {
        const response = await fetch('../data/profesionales.json'); 
        if (!response.ok) throw new Error('Error al cargar los datos de profesionales.');
        const profesionales = await response.json();
        const selectProfesional = document.getElementById('profesional');

        profesionales.forEach(prof => {
            const option = document.createElement('option');
            option.value = prof.nombre;
            option.textContent = prof.nombre;
            selectProfesional.appendChild(option);
        });

        console.log('Profesionales cargados:', profesionales); 
    } catch (error) {
        console.error(error.message);
    } finally {
        console.log('Carga de profesionales completada.');
    }
}

cargarProfesionales();


