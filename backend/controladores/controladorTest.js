'use strict';
//const C = global.config;
const L = global.logger;
const K = global.constants;

// Interfaces
const iMongo = require('interfaces/iMongo/iMongo');

// Modelos
const ModeloError = require('modelos/ModeloError');


// GET /test
exports.test = (req, res) => {

	L.xi(txId, ['Procesando transmisión ']);
	res.status(200).json({ ok: true });
}
