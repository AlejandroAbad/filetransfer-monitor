'use strict';
//const C = global.config;
const L = global.logger;
const K = global.constants;

// Interfaces
const iMongo = require('interfaces/iMongo/iMongo');

// Modelos
const ModeloError = require('modelos/ModeloError');


// GET /consulta/:id
const porId = (req, res) => {

	let idTransferencia = req.params.id;

	if (!idTransferencia) {
		ModeloError.generarYEnviar(res, "No se ha especificado el ID de la transferencia", 500);
		return;
	}

	iMongo.consulta.porId( idTransferencia, (errorMongo, resultado) => {
		if (errorMongo) {
			ModeloError.generarYEnviar(res, errorMongo, 500);
			return;
		}

		res.status(200).send({
			ok: true,
			datos: resultado
		});
	});
}

// POST /consulta
const consulta = (req, res) => {

	let consulta = req.body;

	iMongo.consulta.consulta(consulta, (errorMongo, resultado) => {
		if (errorMongo) {
			ModeloError.generarYEnviar(res, errorMongo, 500);
			return;
		}

		res.status(200).send({
			ok: true,
			datos: resultado
		});
	});
}


// POST /agregacion
const agregacion = (req, res) => {
	let pipeline = req.body;

	iMongo.consulta.agregacion(pipeline, (errorMongo, resultado) => {
		if (errorMongo) {
			ModeloError.generarYEnviar(res, errorMongo, 500);
			return;
		}

		res.status(200).send({
			ok: true,
			datos: resultado
		});
	});
}

module.exports = {
	porId,
	consulta,
	agregacion
}