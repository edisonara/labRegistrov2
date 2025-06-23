const { v4: uuidv4 } = require('uuid');
const { getItem, putItem, queryItems, updateItem, deleteItem } = require('../libs/dynamo');

class BaseRepository {
  constructor(model) {
    this.model = model;
    this.tableName = process.env.DYNAMODB_TABLE;
  }

  async create(item) {
    const id = uuidv4();
    const newItem = new this.model({ ...item, id });
    await putItem(newItem.toItem());
    return newItem;
  }

  async getById(id, partitionKey = null) {
    const pk = partitionKey || this.model.name === 'Laboratorio' ? `LAB#${id}` : 
               this.model.name === 'Asignatura' ? `ASG#${id}` : 
               this.model.name === 'Practica' ? `PRACTICA#${id}` : null;
    
    if (!pk) {
      throw new Error('Invalid model type or missing partition key');
    }

    const sk = this.model.name === 'Parcial' || this.model.name === 'UsoEquipo' ? 
               null : 'META';

    if (sk) {
      const item = await getItem(pk, sk);
      return item ? this.model.fromItem(item) : null;
    } else {
      const items = await queryItems({
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: { ':pk': pk }
      });
      return items.length > 0 ? this.model.fromItem(items[0]) : null;
    }
  }

  async update(id, updates, partitionKey = null) {
    const item = await this.getById(id, partitionKey);
    if (!item) {
      throw new Error(`${this.model.name} not found`);
    }

    const updatedItem = { ...item, ...updates, updatedAt: new Date().toISOString() };
    await putItem(updatedItem.toItem());
    return updatedItem;
  }

  async delete(id, partitionKey = null) {
    const item = await this.getById(id, partitionKey);
    if (!item) {
      throw new Error(`${this.model.name} not found`);
    }

    await deleteItem(item.PK, item.SK || 'META');
    return { success: true };
  }

  async query(params) {
    const items = await queryItems(params);
    return items.map(item => this.model.fromItem(item));
  }
}

module.exports = BaseRepository;
