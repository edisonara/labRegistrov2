const { v4: uuidv4 } = require('uuid');
const {
  createResponse,
  createItem,
  updateItem,
  queryItems,
  getItem,
} = require('../libs/dynamo');

// Register equipment usage
const registrar = async (event) => {
  try {
    const { estudianteId, practicaId, equipoId } = JSON.parse(event.body);
    const id = `USO#${uuidv4()}`;
    const now = new Date().toISOString();
    
    // Verify practice exists
    const practica = await getItem(practicaId, 'META');
    if (!practica) {
      return createResponse(404, { error: 'Práctica no encontrada' });
    }
    
    // Verify lab has the equipment available
    const laboratorio = await getItem(practica.laboratorioId, 'META');
    if (!laboratorio.equiposDisponibles.includes(equipoId)) {
      return createResponse(400, { error: 'Equipo no disponible en este laboratorio' });
    }
    
    // Check if equipment is already in use
    const existingUse = await queryItems({
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk AND begins_with(GSI1SK, :gsi1sk)',
      FilterExpression: '#estado = :estado',
      ExpressionAttributeNames: {
        '#estado': 'estado',
      },
      ExpressionAttributeValues: {
        ':gsi1pk': `EQUIPO#${equipoId}`,
        ':gsi1sk': 'PRACTICA#',
        ':estado': 'EN_USO',
      },
    });

    if (existingUse.length > 0) {
      return createResponse(400, { error: 'El equipo ya está en uso' });
    }
    
    const usoEquipo = {
      PK: id,
      SK: 'META',
      GSI1PK: `EQUIPO#${equipoId}`,
      GSI1SK: `PRACTICA#${practicaId}`,
      tipo: 'UsoEquipo',
      estudianteId,
      practicaId,
      equipoId,
      estado: 'EN_USO',
      horaInicio: now,
      fechaCreacion: now,
    };

    await createItem(usoEquipo);
    return createResponse(201, { id, ...usoEquipo });
  } catch (error) {
    console.error('Error al registrar uso de equipo:', error);
    return createResponse(500, { error: 'No se pudo registrar el uso del equipo' });
  }
};

// Finalize equipment usage
const finalizar = async (event) => {
  try {
    const { id } = event.pathParameters;
    const now = new Date().toISOString();
    
    const updated = await updateItem(
      id,
      'META',
      'SET #estado = :estado, horaFin = :horaFin',
      {
        ':estado': 'FINALIZADO',
        ':horaFin': now,
      },
      {
        '#estado': 'estado',
      }
    );
    
    return createResponse(200, updated);
  } catch (error) {
    console.error('Error al finalizar uso de equipo:', error);
    return createResponse(500, { error: 'Error al finalizar el uso del equipo' });
  }
};

// List all equipment usages
const listar = async () => {
  try {
    const params = {
      IndexName: 'GSI1',
      KeyConditionExpression: 'SK = :sk',
      ExpressionAttributeValues: {
        ':sk': 'META',
      },
      FilterExpression: 'tipo = :tipo',
      ExpressionAttributeValues: {
        ':sk': 'META',
        ':tipo': 'UsoEquipo',
      },
    };
    
    const usos = await queryItems(params);
    return createResponse(200, usos);
  } catch (error) {
    console.error('Error al listar usos de equipos:', error);
    return createResponse(500, { error: 'Error al listar los usos de equipos' });
  }
};

module.exports = {
  registrar,
  finalizar,
  listar,
};
