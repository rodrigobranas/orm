import Entity from "./Entity";
import ORM from "./ORM";

@ORM.entity({ schema: "branas", table: "author" })
export default class Author extends Entity {
	@ORM.pk({ name: "id_author" })
	idAuthor?: number;
	@ORM.column({ name: "name" })
	name: string;

	constructor (name: string) {
		super();
		this.name = name;
	}
}
