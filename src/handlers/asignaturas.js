const { v4: uuidv4 } = require('uuid');
const {
  createResponse,
  createItem,
  getItem,
  queryItems,
} = require('../libs/dynamo');

// Create a new subject
const crear = async (event) => {
  try {
    const { nombre, codigo, docenteId } = JSON.parse(event.body);
    const id = `ASG#${codigo}`;
    
    const asignatura = {
      PK: id,
      SK: 'META',
      tipo: 'Asignatura',
      nombre,
      codigo,
      docenteId,
      fechaCreacion: new Date().toISOString(),
    };

    await createItem(asignatura);
    return createResponse(201, { id, ...asignatura });
  } catch (error) {
    console.error('Error al crear asignatura:', error);
    return createResponse(500, { error: 'No se pudo crear la asignatura' });
  }
};

// Get a subject by ID
const obtener = async (event) => {
  try {
    const { id } = event.pathParameters;
    const asignatura = await getItem(`ASG#${id}`, 'META');
    
    if (!asignatura) {
      return createResponse(404, { error: 'Asignatura no encontrada' });
    }
    
    return createResponse(200, asignatura);
  } catch (error) {
    console.error('Error al obtener asignatura:', error);
    return createResponse(500, { error: 'Error al obtener la asignatura' });
  }
};

// List all subjects
const listar = async () => {
  try {
    const params = {
      KeyConditionExpression: 'SK = :sk AND begins_with(PK, :pk)',
      ExpressionAttributeValues: {
        ':sk': 'META',
        ':pk': 'ASG#'
      }
    };
    
    const asignaturas = await queryItems(params);
    return createResponse(200, asignaturas);
  } catch (error) {
    console.error('Error al listar asignaturas:', error);
    return createResponse(500, { error: 'Error al listar asignaturas' });
  }
};

module.exports = {
  crear,
  obtener,
  listar,
};
