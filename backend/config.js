'use strict';
let C = {};
//const L = global.logger;
const K = global.constants;

const verificarHttp = (config) => {
	if (!config.http) {
		console.error("No se ha definido el nodo HTTP (http)");
		process.exit(K.EXIT_CODES.E_NO_HTTP_CONFIG);
	}
	if (!config.http.port) {
		console.error("No se ha definido el puerto para HTTP (http.port)");
		process.exit(K.EXIT_CODES.E_NO_HTTP_PORT);
	}
};

const verificarMongodb = (config) => {
	if (!config.mongodb) {
		console.error("No se ha definido el nodo para MongoDB (mongodb)");
		process.exit(K.EXIT_CODES.E_NO_MDB_CONFIG);
	}
	if (!config.mongodb.hosts) {
		console.error("No se ha definido la lista de hosts de MongoDB (mongodb.hosts)");
		process.exit(K.EXIT_CODES.E_MDB_NO_HOSTS);
	}
	if (!config.mongodb.username) {
		console.error("No se ha definido el usuario para MongoDB (mongodb.username)");
		process.exit(K.EXIT_CODES.E_MDB_NO_USER);
	}
	if (!config.mongodb.pwd) {
		console.error("No se ha definido la clave para el usuario de MongoDB (mongodb.pwd)");
		process.exit(K.EXIT_CODES.E_MDB_NO_PASS);
	}
	if (!config.mongodb.database) {
		console.error("No se ha definido el nombre de la base de datos de MongoDB (mongodb.database)");
		process.exit(K.EXIT_CODES.E_MDB_NO_DATABASE);
	}
};


const _verificadorConfiguracion = {
	verificarHttp,
	verificarMongodb,
};


const FICHERO_CONFIGURACION = process.env.FTMON_CONFIG_FILE || 'config.json';
try {
	C = require(FICHERO_CONFIGURACION);

	// Verificando la configuración mínima.
	// Los siguientes métodos detienen la ejecución en caso de fallo

	_verificadorConfiguracion.verificarHttp(C);
	_verificadorConfiguracion.verificarMongodb(C);

} catch (excepcion) {
	console.error("**** NO SE ENCUENTRA EL FICHERO DE CONFIGURACIÓN O NO ES VÁLIDO");
	console.error(excepcion);
	process.exit(K.EXIT_CODES.E_NO_CONFIG);
}


C.urlConexionMongo = (servidores, usuario, password, db, replicaSet) => {

	servidores = servidores ? servidores : C.mongodb.hosts;
	usuario = usuario ? usuario : C.mongodb.username;
	password = password ? password : C.mongodb.pwd;
	db = db ? db : C.mongodb.database;
	replicaSet = replicaSet ? replicaSet : C.mongodb.replicaset; 

	let url = 'mongodb://' + usuario + ':' + password + '@' + servidores.join(',') + '/' + db + (replicaSet ? '?replicaSet=' + replicaSet : '');
	return url;
}

module.exports = C;
