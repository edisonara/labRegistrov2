const { v4: uuidv4 } = require('uuid');
const {
  createResponse,
  createItem,
  queryItems,
  updateItem,
} = require('../libs/dynamo');

// Create a new exam for a subject
const crear = async (event) => {
  try {
    const { asignaturaId } = event.pathParameters;
    const { nombre, fechaInicio } = JSON.parse(event.body);
    const id = `PARCIAL#${uuidv4()}`;
    
    const parcial = {
      PK: `ASG#${asignaturaId}`,
      SK: id,
      tipo: 'Parcial',
      nombre,
      fechaInicio,
      asignaturaId,
      fechaCreacion: new Date().toISOString(),
    };

    await createItem(parcial);
    
    // Update the subject to include this exam
    await updateItem(
      `ASG#${asignaturaId}`,
      'META',
      'SET #parciales = list_append(if_not_exists(#parciales, :empty_list), :parcial)',
      { 
        ':empty_list': [],
        ':parcial': [id]
      },
      { '#parciales': 'parciales' }
    );

    return createResponse(201, { id, ...parcial });
  } catch (error) {
    console.error('Error al crear parcial:', error);
    return createResponse(500, { error: 'No se pudo crear el parcial' });
  }
};

// List all exams for a subject
const listar = async (event) => {
  try {
    const { asignaturaId } = event.pathParameters;
    
    const params = {
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `ASG#${asignaturaId}`,
        ':sk': 'PARCIAL#'
      }
    };
    
    const parciales = await queryItems(params);
    return createResponse(200, parciales);
  } catch (error) {
    console.error('Error al listar parciales:', error);
    return createResponse(500, { error: 'Error al listar los parciales' });
  }
};

module.exports = {
  crear,
  listar,
};
