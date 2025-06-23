const { v4: uuidv4 } = require('uuid');
const {
  createResponse,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} = require('../libs/dynamo');

// Create a new laboratory
const crear = async (event) => {
  try {
    const { nombre, ubicacion, equiposDisponibles = [] } = JSON.parse(event.body);
    const id = `LAB#${uuidv4()}`;
    
    const laboratorio = {
      PK: id,
      SK: 'META',
      tipo: 'Laboratorio',
      nombre,
      ubicacion,
      equiposDisponibles,
      fechaCreacion: new Date().toISOString(),
    };

    await createItem(laboratorio);
    return createResponse(201, { id, ...laboratorio });
  } catch (error) {
    console.error('Error al crear laboratorio:', error);
    return createResponse(500, { error: 'No se pudo crear el laboratorio' });
  }
};

// Get a laboratory by ID
const obtener = async (event) => {
  try {
    const { id } = event.pathParameters;
    const laboratorio = await getItem(id, 'META');
    
    if (!laboratorio) {
      return createResponse(404, { error: 'Laboratorio no encontrado' });
    }
    
    return createResponse(200, laboratorio);
  } catch (error) {
    console.error('Error al obtener laboratorio:', error);
    return createResponse(500, { error: 'Error al obtener el laboratorio' });
  }
};

// List all laboratories
const listar = async () => {
  try {
    const params = {
      KeyConditionExpression: 'SK = :sk AND begins_with(PK, :pk)',
      ExpressionAttributeValues: {
        ':sk': 'META',
        ':pk': 'LAB#'
      }
    };
    
    const laboratorios = await queryItems(params);
    return createResponse(200, laboratorios);
  } catch (error) {
    console.error('Error al listar laboratorios:', error);
    return createResponse(500, { error: 'Error al listar laboratorios' });
  }
};

// Update a laboratory
const actualizar = async (event) => {
  try {
    const { id } = event.pathParameters;
    const updates = JSON.parse(event.body);
    
    // Build update expression
    const updateExpression = 'SET ' + Object.keys(updates)
      .map(key => `#${key} = :${key}`)
      .join(', ');
    
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};
    
    for (const [key, value] of Object.entries(updates)) {
      expressionAttributeValues[`:${key}`] = value;
      expressionAttributeNames[`#${key}`] = key;
    }
    
    const updated = await updateItem(
      id,
      'META',
      updateExpression,
      expressionAttributeValues,
      expressionAttributeNames
    );
    
    return createResponse(200, updated);
  } catch (error) {
    console.error('Error al actualizar laboratorio:', error);
    return createResponse(500, { error: 'Error al actualizar el laboratorio' });
  }
};

// Delete a laboratory
const eliminar = async (event) => {
  try {
    const { id } = event.pathParameters;
    await deleteItem(id, 'META');
    return createResponse(200, { message: 'Laboratorio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar laboratorio:', error);
    return createResponse(500, { error: 'Error al eliminar el laboratorio' });
  }
};

module.exports = {
  crear,
  obtener,
  listar,
  actualizar,
  eliminar,
};
