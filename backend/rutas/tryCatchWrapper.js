'use strict';
//const C = global.config;
const L = global.logger;
//const K = global.constants;

const ModeloError = require('modelos/ModeloError');


const tryCatch = (funcionControlador) => {
	let controlador = (req, res) => {
		try {
			funcionControlador(req, res);
		} catch (excepcion) {
			ModeloError.generarYEnviar(res, excepcion, 500);
			L.f(['Ocurrió una excepcion al ejecutar la petición', errorToLog])
			L.dump(excepcion, req)
			return;
		}
	}
	return controlador;
}




module.exports = tryCatch;