export default class Entity {
	declare schema: string;
	declare table: string;
	declare pk: { property: string, column: string };
	declare columns: { property: string, column: string }[];
	declare relationships: { property: string, entity: any }[]
	[key: string]: any;
}