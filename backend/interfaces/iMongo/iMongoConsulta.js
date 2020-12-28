'use strict';
//const C = global.config;
const L = global.logger;
//const K = global.constants;

// Externas
const { EJSON } = require('bson');


// Interfaces
const MDB = require('./iMongoConexion');
const ObjectID = require('mongodb').ObjectID;



const consulta = (consulta, callback) => {

	L.i('Realizando consulta');
	L.d(['Consulta de transferencias', consulta]);

	let filtro = consulta.filtro || {};
	let proyeccion = consulta.proyeccion || null;
	let orden = consulta.orden || null;
	let skip = consulta.skip || 0;
	let limite = Math.min(consulta.limite || 50, 50);

	let filtroMongo = {}
	try {
		filtroMongo = EJSON.deserialize(filtro, { relaxed: false });
	} catch (errorDeserializadoEJSON) {
		L.e(['Error en la deserialización de la consulta EJSON', errorDeserializadoEJSON])
		callback(new Error('La consulta no es válida'), null);
		return;
	}

	// No se admiten '$or' vacíos, mongo peta
	if (filtroMongo.$or && filtroMongo.$or.length === 0) {
		delete filtroMongo.$or;
	}

	if (MDB.col()) {
		let cursor = MDB.col().find(filtroMongo);
		if (proyeccion) cursor.project(proyeccion);
		if (orden) cursor.sort(orden);
		if (skip) cursor.skip(skip);
		if (limite) cursor.limit(limite);

		cursor.count(false, (errorMongoCount, count) => {
			if (errorMongoCount) return callback(errorMongoCount, null);

			cursor.toArray((errorMongoToArray, resultados) => {
				if (errorMongoToArray) return callback(errorMongoToArray, null);

				return callback(null, {
					resultados: resultados,
					limite: limite,
					skip: skip,
					total: count
				});

			});
		});

	} else {
		callback(new Error('No conectado a MongoDB'), null);
	}
}


const agregacion = (pipeline, callback) => {

	L.xi('Realizando agregación');
	L.xd(['Agregacion de transferencias', pipeline]);

	try {
		pipeline = EJSON.deserialize(pipeline, { relaxed: false });
	} catch (errorDeserializadoEJSON) {
		L.e(['Error en la deserialización de la consulta EJSON', errorDeserializadoEJSON])
		callback(new Error('La consulta de agregación no es válida'), null);
		return;
	}


	if (MDB.col()) {
		MDB.col().aggregate(pipeline).toArray(callback);
	} else {
		callback(new Error('No conectado a MongoDB'), null);
	}

}

/**
 * Busca la transmisión con el ID indicado
 * @param {*} id 
 * @param {*} callback 
 */
const porId = (id, callback) => {
	try {
		id = new ObjectID(id);
	} catch (excepcionObjectID) {
		L.e( ['El ID de la transmisión no es un ObjectID válido', id, excepcionObjectID]);
		callback(excepcionObjectID, null);
		return;
	}

	_consultaUnaTransmision({ _id: id }, callback);
};




module.exports = {
	consulta,
	agregacion,
	porId,
}



const _consultaUnaTransmision = (filtro, callback) => {
	if (MDB.col()) {
		L.d(['Buscando transmisión', filtro]);
		MDB.col().findOne(filtro, callback);
	} else {
		L.e(['Error al localizar la transmisión']);
		callback(new Error('No conectado a MongoDB'), null);
	}
}