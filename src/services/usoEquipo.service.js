const usoEquipoRepository = require('../repositories/usoEquipo.repository');
const practicaService = require('./practica.service');
const laboratorioService = require('./laboratorio.service');

class UsoEquipoService {
  async registrarUso(data) {
    // Verificar que la práctica existe
    const practica = await practicaService.getPractica(data.practicaId);
    
    // Verificar que el laboratorio existe y obtener sus equipos
    const laboratorio = await laboratorioService.getLaboratorio(practica.laboratorioId);
    
    // Validar que el equipo pertenece al laboratorio
    if (!laboratorio.equiposDisponibles.includes(data.equipo)) {
      throw new Error('El equipo no pertenece al laboratorio de la práctica');
    }
    
    // Verificar que el equipo esté disponible en el horario de la práctica
    const disponible = await usoEquipoRepository.verificarDisponibilidadEquipo(
      practica.laboratorioId,
      data.equipo,
      practica.fecha,
      practica.horaInicio,
      practica.horaFin
    );
    
    if (!disponible) {
      throw new Error('El equipo no está disponible en el horario de la práctica');
    }
    
    // Verificar que el estudiante no tenga otro uso activo
    const usosActivos = await usoEquipoRepository.query({
      KeyConditionExpression: 'PK = :pk',
      FilterExpression: 'estado = :estado',
      ExpressionAttributeValues: {
        ':pk': `EST#${data.estudianteId}`,
        ':estado': 'activo'
      }
    });
    
    if (usosActivos && usosActivos.length > 0) {
      throw new Error('El estudiante ya tiene un uso de equipo activo');
    }
    
    // Crear el registro de uso
    return usoEquipoRepository.create({
      ...data,
      laboratorioId: practica.laboratorioId,
      estado: 'activo',
      horaInicio: new Date().toISOString()
    });
  }

  async finalizarUso(id, estudianteId) {
    return usoEquipoRepository.finalizarUso(id, estudianteId);
  }

  async getUso(id, estudianteId) {
    const uso = await usoEquipoRepository.getById(id, `EST#${estudianteId}`);
    if (!uso) {
      throw new Error('Uso de equipo no encontrado');
    }
    return uso;
  }

  async listUsosByEstudiante(estudianteId) {
    return usoEquipoRepository.getByEstudiante(estudianteId);
  }

  async listUsosByPractica(practicaId) {
    await practicaService.getPractica(practicaId);
    return usoEquipoRepository.getByPractica(practicaId);
  }

  async listUsosByLaboratorio(laboratorioId) {
    await laboratorioService.getLaboratorio(laboratorioId);
    return usoEquipoRepository.getByLaboratorio(laboratorioId);
  }

  async getEstadisticasLaboratorio(laboratorioId) {
    const laboratorio = await laboratorioService.getLaboratorio(laboratorioId);
    const usos = await this.listUsosByLaboratorio(laboratorioId);
    
    // Calcular estadísticas por equipo
    const estadisticasPorEquipo = {};
    laboratorio.equiposDisponibles.forEach(equipo => {
      estadisticasPorEquipo[equipo] = {
        totalUsos: 0,
        tiempoTotalUso: 0, // en minutos
        ultimoUso: null
      };
    });
    
    // Procesar cada uso
    usos.forEach(uso => {
      if (uso.estado === 'finalizado' && uso.equipo) {
        const equipo = uso.equipo;
        const tiempoUso = (new Date(uso.horaFin) - new Date(uso.horaInicio)) / (1000 * 60); // en minutos
        
        estadisticasPorEquipo[equipo].totalUsos += 1;
        estadisticasPorEquipo[equipo].tiempoTotalUso += tiempoUso;
        
        if (!estadisticasPorEquipo[equipo].ultimoUso || 
            new Date(uso.horaFin) > new Date(estadisticasPorEquipo[equipo].ultimoUso)) {
          estadisticasPorEquipo[equipo].ultimoUso = uso.horaFin;
        }
      }
    });
    
    // Calcular promedios
    Object.keys(estadisticasPorEquipo).forEach(equipo => {
      const stats = estadisticasPorEquipo[equipo];
      stats.tiempoPromedioUso = stats.totalUsos > 0 
        ? stats.tiempoTotalUso / stats.totalUsos 
        : 0;
    });
    
    return {
      laboratorio: {
        id: laboratorio.id,
        nombre: laboratorio.nombre,
        totalEquipos: laboratorio.equiposDisponibles.length,
        totalUsos: usos.length,
        usosFinalizados: usos.filter(u => u.estado === 'finalizado').length,
        usosActivos: usos.filter(u => u.estado === 'activo').length
      },
      estadisticasPorEquipo
    };
  }
}

module.exports = new UsoEquipoService();
