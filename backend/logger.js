'use strict';
const C = global.config;
let L = {};
const K = global.constants;

const fs = require('fs');
const logDir = C.logdir || '.';
const util = require('util');


const TRACE = 'TRC'
const DEBUG = 'DBG'
const INFO = 'INF'
const WARN = 'WRN'
const ERROR = 'ERR'
const FATAL = 'DIE'


const _obtenerFicheroLog = (timestamp, esParaDump) => {
	let fecha = Date.toShortDate(timestamp)
	if (esParaDump) fecha += '.' + Date.toShortTime(timestamp)
	return logDir + '/' + fecha + '-' + process.title + '-' + process.pid + (esParaDump ? '.dump' : '.log')
}

const grabarLog = (evento) => {

	let txId = evento.tx
	let categoria = evento.categoria && evento.categoria.padStart ? evento.categoria.padStart(15) : evento.categoria;

	let hora = Date.toShortTime(evento.timestamp)
	let mensaje = (txId ? txId + '|' : '') + hora + '|' + evento.level + '|' + categoria + '|' + JSON.stringify(evento.datos)

	/*fs.appendFile(_obtenerFicheroLog(evento.timestamp), mensaje + '\n', (err) => {
		if (err) {
			console.log(mensaje)
			console.log('###', err)
		}
	})*/

	if (C.logconsole) {
		console.log(mensaje)
	}

}

const logGeneral = (datos, nivel, categoria) => {
	if (!Array.isArray(datos)) datos = [datos];

	let evento = {
		categoria: categoria || 'server',
		level: nivel || INFO,
		datos: datos,
		timestamp: new Date()
	}
	grabarLog(evento);
};

const dump = (err, req) => {

	let message = (new Date).toUTCString() + '\n\n'
	message += err.stack


	if (req) {
		message += '\n\nPETICIÓN HTTP\n=============\n'
		message += 'IP: ' + req.ip + ' (' + req.protocol + ')\n'
		message += req.method + ' ' + req.originalUrl + ' HTTP/' + req.httpVersion + '\n'
		message += util.inspect(req.headers) + '\n\n'
		message += util.inspect(req.body)
	}

	/*
	fs.appendFileSync(_obtenerFicheroLog(new Date(), true), message, (err) => {
		if (err) {
			console.error(message)
			console.error('###', err)
		}
	})
	*/

	if (C.logconsole) {
		console.log('DUMP GENERADO: ' + _obtenerFicheroLog(new Date(), true))
		console.log(message)
	}

}

L = {
	t: (datos) => logGeneral(datos, TRACE),
	d: (datos) => logGeneral(datos, DEBUG),
	i: (datos) => logGeneral(datos, INFO),
	w: (datos) => logGeneral(datos, WARN),
	e: (datos) => logGeneral(datos, ERROR),
	f: (datos) => logGeneral(datos, FATAL),
	dump: dump
};


module.exports = L;
