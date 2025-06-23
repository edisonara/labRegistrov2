const { v4: uuidv4 } = require('uuid');
const {
  createResponse,
  createItem,
  queryItems,
  getItem,
} = require('../libs/dynamo');

// Create a new practice session
const crear = async (event) => {
  try {
    const { nombre, fecha, parcialId, laboratorioId } = JSON.parse(event.body);
    const id = `PRACTICA#${uuidv4()}`;
    
    // Verify the lab exists
    const laboratorio = await getItem(laboratorioId, 'META');
    if (!laboratorio) {
      return createResponse(404, { error: 'Laboratorio no encontrado' });
    }
    
    const practica = {
      PK: id,
      SK: 'META',
      tipo: 'Practica',
      nombre,
      fecha,
      parcialId,
      laboratorioId,
      estado: 'PENDIENTE',
      fechaCreacion: new Date().toISOString(),
    };

    await createItem(practica);
    
    // Update the exam to include this practice
    await createItem({
      PK: id,
      SK: `PARENT#${parcialId}`,
      tipo: 'PracticaParcial',
      nombre,
      fecha,
    });

    return createResponse(201, { id, ...practica });
  } catch (error) {
    console.error('Error al crear práctica:', error);
    return createResponse(500, { error: 'No se pudo crear la práctica' });
  }
};

// List all practice sessions
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
        ':tipo': 'Practica',
      },
    };
    
    const practicas = await queryItems(params);
    return createResponse(200, practicas);
  } catch (error) {
    console.error('Error al listar prácticas:', error);
    return createResponse(500, { error: 'Error al listar las prácticas' });
  }
};

module.exports = {
  crear,
  listar,
};
