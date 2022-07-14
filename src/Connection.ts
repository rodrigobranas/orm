import pgp from "pg-promise";

export default class Connection {
	pgp: any;

	constructor () {
		this.pgp = pgp()("postgres://postgres:123456@localhost:5432/app");
	}

	async query (statement: string, params: any) {
		return this.pgp.query(statement, params);
	}

	async close () {
		return this.pgp.$pool.end();
	}
}