import Author from "./Author";
import Entity from "./Entity";
import ORM from "./ORM";

@ORM.entity({ schema: "branas", table: "book" })
export default class Book extends Entity {
	@ORM.pk({ name: "id_book" })
	idBook?: number;
	@ORM.column({ name: "title" })
	title: string;
	@ORM.relationship
	author: Author;

	constructor (title: string, author: Author) {
		super();
		this.title = title;
		this.author = author;
	}
}
