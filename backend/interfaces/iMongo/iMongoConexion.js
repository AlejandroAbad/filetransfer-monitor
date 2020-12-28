'use strict';
const C = global.config;
const L = global.logger;
//const K = global.constants;

// Externo
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;


const MONGODB_OPTIONS = {
	connectTimeoutMS: 5000,
	serverSelectionTimeoutMS: 5000,
	w: C.mongodb.writeconcern || 1,
	wtimeout: 1000,
	useUnifiedTopology: true,
	appname: global.instanceID,
	loggerLevel: 'warn'
};

let coleccion = null;
let clienteDb;

const conectar = () => {
	if (clienteDb) return;

	clienteDb = new MongoClient(C.urlConexionMongo(), MONGODB_OPTIONS);
	clienteDb.connect()
		.then((cliente) => {
			clienteDb = cliente;
			let bdFileTransfer = clienteDb.db(C.mongodb.database);

			let nombreColeccion = C.mongodb.coleccion || 'transferencias';
			coleccion = bdFileTransfer.collection(nombreColeccion);
			L.i(['*** Conexión a la colección [' + C.mongodb.database + '.' + nombreColeccion + ']']);


		})
		.catch(error => {
			clienteDb = null;
			L.f(['*** Error en la conexión a de MongoDB ***', C.urlConexionMongo(), error]);
		});
}

conectar();
setInterval(conectar, 10000);


module.exports = {
	ObjectID,
	cliente: () => clienteDb,
	db: (nombreDB) => clienteDb.db(nombreDB || C.mongodb.database),
	col: () => coleccion
};
