drop table branas.author;
drop table branas.book;

create table branas.book (
	id_book serial,
	title text
);

create table branas.author (
	id_author serial,
	id_book integer,
	name text
);
