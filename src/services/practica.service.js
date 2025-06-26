const practicaRepository = require('../repositories/practica.repository');
const parcialService = require('./parcial.service');
const laboratorioService = require('./laboratorio.service');
const usoEquipoRepository = require('../repositories/usoEquipo.repository');

class PracticaService {
  // Métodos genéricos esperados por BaseController
  async create(data) {
    return this.createPractica(data);
  }

  async getById(id) {
    return this.getPractica(id);
  }

  async update(id, data) {
    return this.updatePractica(id, data);
  }

  async delete(id) {
    return this.deletePractica(id);
  }

  async list() {
    // Lista de prácticas podría requerir parámetros; devolvemos error explícito
    throw new Error('Para listar prácticas use listPracticasByParcial o listPracticasByLaboratorio');
  }


  async createPractica(data) {
    // Verificar que el parcial existe
    await parcialService.getParcial(data.parcialId, data.asignaturaId);
    
    // Verificar que el laboratorio existe
    const laboratorio = await laboratorioService.getLaboratorio(data.laboratorioId);
    
    // Validar que el laboratorio tenga equipos disponibles
    if (!laboratorio.equiposDisponibles || laboratorio.equiposDisponibles.length === 0) {
      throw new Error('El laboratorio no tiene equipos disponibles');
    }
    
    // Validar fechas
    if (new Date(data.horaInicio) >= new Date(data.horaFin)) {
      throw new Error('La hora de inicio debe ser anterior a la hora de fin');
    }
    
    // Verificar disponibilidad del laboratorio
    const disponibilidad = await laboratorioService.getDisponibilidad(
      data.laboratorioId,
      data.fecha,
      data.horaInicio,
      data.horaFin
    );
    
    if (disponibilidad.equiposDisponiblesCount === 0) {
      throw new Error('No hay equipos disponibles en el laboratorio para el horario seleccionado');
    }
    
    return practicaRepository.create(data);
  }

  async getPractica(id) {
    const practica = await practicaRepository.getById(id);
    if (!practica) {
      throw new Error('Práctica no encontrada');
    }
    return practica;
  }

  async updatePractica(id, data) {
    const practica = await this.getPractica(id);
    
    // Si se está actualizando el laboratorio, verificar disponibilidad
    if (data.laboratorioId && data.laboratorioId !== practica.laboratorioId) {
      const laboratorio = await laboratorioService.getLaboratorio(data.laboratorioId);
      
      if (!laboratorio.equiposDisponibles || laboratorio.equiposDisponibles.length === 0) {
        throw new Error('El laboratorio no tiene equipos disponibles');
      }
      
      // Verificar disponibilidad del nuevo laboratorio
      const disponibilidad = await laboratorioService.getDisponibilidad(
        data.laboratorioId,
        data.fecha || practica.fecha,
        data.horaInicio || practica.horaInicio,
        data.horaFin || practica.horaFin
      );
      
      if (disponibilidad.equiposDisponiblesCount === 0) {
        throw new Error('No hay equipos disponibles en el laboratorio para el horario seleccionado');
      }
    }
    
    // Si se está actualizando el horario, verificar disponibilidad
    if (data.horaInicio || data.horaFin) {
      const disponibilidad = await laboratorioService.getDisponibilidad(
        data.laboratorioId || practica.laboratorioId,
        data.fecha || practica.fecha,
        data.horaInicio || practica.horaInicio,
        data.horaFin || practica.horaFin
      );
      
      // Obtener equipos en uso en esta práctica
      const usos = await usoEquipoRepository.getByPractica(id);
      const equiposEnUso = usos.map(uso => uso.equipo);
      
      // Verificar que los equipos en uso sigan estando disponibles
      const equiposDisponibles = disponibilidad.equiposDisponibles;
      const todosEquiposDisponibles = equiposEnUso.every(equipo => 
        equiposDisponibles.includes(equipo)
      );
      
      if (!todosEquiposDisponibles) {
        throw new Error('No se puede actualizar la práctica porque algunos equipos ya no están disponibles en el nuevo horario');
      }
    }
    
    return practicaRepository.update(id, data);
  }

  async deletePractica(id) {
    // Verificar que no tenga usos de equipos asociados
    const usos = await usoEquipoRepository.getByPractica(id);
    if (usos && usos.length > 0) {
      throw new Error('No se puede eliminar la práctica porque tiene registros de uso de equipos');
    }

    return practicaRepository.delete(id);
  }

  async listPracticasByParcial(parcialId, asignaturaId) {
    await parcialService.getParcial(parcialId, asignaturaId);
    return practicaRepository.getByParcial(parcialId);
  }

  async listPracticasByLaboratorio(laboratorioId, fecha = null) {
    await laboratorioService.getLaboratorio(laboratorioId);
    return practicaRepository.getByLaboratorio(laboratorioId, fecha);
  }

  async getPracticaConUsos(id) {
    const practica = await this.getPractica(id);
    const usos = await usoEquipoRepository.getByPractica(id);
    
    return {
      ...practica,
      usos: usos || []
    };
  }
}

module.exports = new PracticaService();
