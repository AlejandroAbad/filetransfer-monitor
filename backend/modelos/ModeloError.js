'use strict';
//const C = global.config;
const L = global.logger;
//const K = global.constants;

class ModeloError {

	constructor(error, codigoHttp) {
		this.mensaje = 'Error desconocido';
		this.codigoHttp = (typeof codigoHttp === 'number') ? codigoHttp : 500;

		// Si 'error' es un string
		if (error && typeof error === 'string') {
			this.mensaje = error;
		}
		// Si 'error' es un error devuelto por Express
		else if (error && error.type && error.statusCode) {

			if (error.type === 'entity.parse.failed') {
				this.codigoHttp = 400;
				this.mensaje = 'No se entiende el cuerpo del mensaje';
			} else {
				L.e('ERROR EXPRESS NO CONTROLADO: ' + error.type);
				this.mensaje = 'Error desconocido [' + error.type + ']';
			}
			return this;
		}
		// Si 'error' es un una excepcion
		else if (error.stack && error.stack.split) {
			this.mensaje = error.stack.split(/\r?\n/);
		}
	}

	enviarRespuestaDeError(expressRes) {
		expressRes.status(this.codigoHttp).json({ ok: false, msg: this.mensaje });
	}

	static generarYEnviar(expressRes, error, codigoHttp) {
		let error = new ModeloError(error, codigoHttp);
		error.enviarRespuestaDeError(expressRes);
	}

}

module.exports = ModeloError;
