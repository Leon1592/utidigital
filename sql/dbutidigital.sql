create table usuarios (
id serial int not null generated always primary key,
nome varchar(150) not null,
email varchar(150) unique not null,
);



create table administradores(
id serial int not null generated always primary key,
nome varchar (100) not null,
email varchar (150) unique not null,
foreign key(id) references usuarios(id)
);




