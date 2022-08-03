import Author from "./Author";
import Book from "./Book";
import Connection from "./Connection";
import ORM from "./ORM";

async function init () {
	const book = new Book("Implementing Domain-Driven Design", new Author("Vaughn Vernon"));
	const connection = new Connection();
	const orm = new ORM(connection);
	await orm.save(book);
	const books = await orm.list(Book);
	// console.log(books);
	const oneBook = await orm.get(Book, 50);
	console.log(oneBook.title);
	console.log(oneBook.author.name);
	await connection.close();
}
init();
