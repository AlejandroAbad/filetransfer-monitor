'use strict';
require('app-module-path').addPath(__dirname);

global.constants = require('constantes');
global.config = require('config');
global.logger = require('logger');



const C = global.config;
const L = global.logger;
const K = global.constants;

process.title = K.PROCESS_TITLE;


process.on('uncaughtException', (excepcionNoControlada) => {
	L.dump(excepcionNoControlada)
	process.exit(1)
})

require('extensionesNativas');

L.i('**** ARRANCANDO MONITOR FILETRANSFER - ' + K.SERVER_VERSION + ' ****');


const HTTP = require('http');
const configuracionHTTP = C.http;

let app = require('express')();
let cors = require('cors');
app.use(cors());
app.disable('x-powered-by');
app.disable('etag');
app.use(require('body-parser').json({ extended: true }));

// Carga de rutas
let rutasHTTP = require('rutas/rutas');
rutasHTTP(app);


try {
	HTTP.createServer(app).listen(configuracionHTTP.port, () => {
		L.i("Servidor HTTP a la escucha en el puerto " + configuracionHTTP.port);
	}).on('error', (err) => {
		L.e("Ocurrió un error al arrancar el servicio HTTP");
		L.e(err);
		process.exit(K.EXIT_CODES.E_HTTP_SERVER_ERROR);
	});
} catch (excepcionArranqueServidorHTTP) {
	L.f("Ocurrió un error al arrancar el servicio HTTP");
	L.f(excepcionArranqueServidorHTTP);
	process.exit(K.EXIT_CODES.E_HTTP_SERVER_ERROR);
}

