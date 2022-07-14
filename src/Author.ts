import Entity from "./Entity";
import ORM from "./ORM";

@ORM.entity({ schema: "branas", table: "author" })
export default class Author extends Entity {
	@ORM.column({ name: "name" })
	name: string;

	constructor (name: string) {
		super();
		this.name = name;
	}
}
