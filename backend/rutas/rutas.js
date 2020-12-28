'use strict';
//const C = global.config;
const L = global.logger;
//const K = global.constants;

// Helpers
const ModeloError = require('modelos/ModeloError');
const tryCatch = require('rutas/tryCatchWrapper');


module.exports = (app) => {

	let controladores = {
		test: require('controladores/controladorTest'),
		consulta: require('controladores/controladorConsulta')
	}
	
	/* Middleware que se ejecuta antes de buscar la ruta correspondiente.
	 * Detecta errores comunes en las peticiones entrantes tales como:
	 *  - Errores en el parseo del JSON entrante.
	 */
	app.use((errorExpress, req, res, next) => {
		if (errorExpress) {
			L.e('** Recibiendo transmisión erronea desde ' + req.originIp);
			ModeloError.generarYEnviar(res, errorExpress);
		} else {
			next();
		}
	});

	/* RUTAS */
	app.route('/test')
		.get(tryCatch(controladores.test.test));

	app.route('/consulta/:id')
		.get(tryCatch(controladores.consulta.porId));

	app.route('/consulta')
		.post(tryCatch(controladores.consulta.consulta));

	app.route('/agregacion')
		.post(tryCatch(controladores.consulta.agregacion));

		
	/* Middleware que se ejecuta tras no haberse hecho matching con ninguna ruta. */
	app.use((req, res, next) => {
		L.w('Se descarta la transmisión porque el endpoint [' + req.originalUrl + '] no existe');
		ModeloError.generarYEnviar(res, 'No existe el endpoint indicado', 404);
	});

};
