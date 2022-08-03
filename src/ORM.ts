import Connection from "./Connection";
import Entity from "./Entity";

export default class ORM {
	constructor (readonly connection: Connection) {
	}

	async insert (entity: Entity, key?: string, property?: string, value?: number) {
		if (key && property && value) {
			entity.columns.push({ property, column: key });
			entity[property] = value;
		}
		const columns = entity.columns.map(column => column.column).join(",");
		const params = entity.columns.map((column, index) => `$${index + 1}`).join(",");
		const values = entity.columns.map(column => entity[column.property]);
		const statement = `insert into ${entity.schema}.${entity.table} (${columns}) values (${params}) returning *`;
		return this.connection.query(statement, [...values]);
	}

	async save (entity: Entity) {
		const [data] = await this.insert(entity);
		if (entity.relationships) {
			for (const relationship of entity.relationships) {
				this.insert(entity[relationship.property], entity.pk.column, entity.pk.property, data[entity.pk.column]);
			}
		}
	}

	build (entity: any, element: any) {
		const obj = new entity();
		for (const column of entity.prototype.columns) {
			obj[column.property] = element[column.column];
		}
		obj[entity.prototype.pk.property] = element[entity.prototype.pk.column];
		return obj;
	}

	async list (entity: any) {
		const statement = `select * from ${entity.prototype.schema}.${entity.prototype.table}`;
		const data = await this.connection.query(statement, []);
		const entities = [];
		for (const element of data) {
			const obj = this.build(entity, element);
			entities.push(obj);
		}
		return entities;
	}

	async get (entity: any, id: number) {
		const statement = `select * from ${entity.prototype.schema}.${entity.prototype.table} where ${entity.prototype.pk.column} = $1`;
		const [data] = await this.connection.query(statement, [id]);
		const obj = this.build(entity, data);
		for (const relationship of obj.relationships) {
			const statement = `select * from ${relationship.entity.prototype.schema}.${relationship.entity.prototype.table} where ${entity.prototype.pk.column} = $1`;
			const [data] = await this.connection.query(statement, [id]);
			obj[relationship.property] = this.build(relationship.entity, data);
		}
		return obj;
	}

	static entity (config: { schema: string, table: string }) {
		return (constructor: Function) => {
			constructor.prototype.schema = config.schema;
			constructor.prototype.table = config.table;
		}
	}
	
	static column (config: { name: string }) {
		return (target: Entity, propertyKey: string) => {
			target.columns = target.columns || [];
			target.columns.push({ property: propertyKey, column: config.name });
		}
	}

	static pk (config: { name: string }) {
		return (target: Entity, propertyKey: string) => {
			target.pk = { property: propertyKey, column: config.name };
		}
	}

	static relationship (config: { entity: Function }) {
		return (target: Entity, propertyKey: string) => {
			target.relationships = target.relationships || [];
			target.relationships.push({ property: propertyKey, entity: config.entity });
		}
	}
}
