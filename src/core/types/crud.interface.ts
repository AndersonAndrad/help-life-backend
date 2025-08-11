export interface CrudRepository<Entity, Filter = any> {
  create(entity: Omit<Entity, '_id'>): Promise<Entity>;

  find(filter: Filter): Promise<Entity[]>;

  findOne(id: string): Promise<Entity>;

  updateOne(id: string, entity: Entity): Promise<Entity>;

  delete(id: string): Promise<void>;
}
