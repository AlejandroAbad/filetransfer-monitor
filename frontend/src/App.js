import { useCallback, useEffect, useRef } from 'react';
import { useApiCall } from './hooks/useApiCall';
// import ReactJson from 'react-json-view';
import { Container } from 'react-bootstrap';
import { Transferencia } from 'transferencias/Transferencia';
import { Formulario } from 'formulario/Formulario';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {

	let { resultado, ejecutarConsulta } = useApiCall();
	let refFormulario = useRef({});






	const realizarLlamadaAPI = useCallback(() => {


		let filtro = { timestamp: { '$lt': (new Date()).getTime() } };


		let timestamp = refFormulario.current?.timestamp?.current
		if (timestamp.from) filtro.timestamp['$gt'] = timestamp.from.getTime()
		if (timestamp.to) filtro.timestamp['$lt'] = timestamp.to.getTime()

		let sentidoTransmision = refFormulario.current?.sentidoTransmision?.current?.value;
		if (sentidoTransmision) filtro.sentidoTransmision = sentidoTransmision;

		let protocolo = refFormulario.current?.protocolo?.current?.value;
		if (protocolo) filtro.protocolo = protocolo;

		let hostLocal = refFormulario.current?.hostLocal?.current?.value;
		if (hostLocal) filtro.hostLocal = hostLocal;

		let hostDestino = refFormulario.current?.hostDestino?.current?.value;
		if (hostDestino) filtro.hostDestino = hostDestino;

		let codigoRetorno = refFormulario.current?.codigoRetorno?.current?.value;
		if (codigoRetorno) {
			switch (codigoRetorno) {
				case "ERR":
					filtro.codigoRetorno = { '$ne': 0 }; break;
				case "NOERR":
					filtro.codigoRetorno = 0; break;
				default:
			}
		}

		let comentario = refFormulario.current?.comentario?.current?.value;
		if (comentario) filtro.comment = comentario;




		/*
				let filtro = {
					
					"timestamp": 1603429361581,
					"argumentos": "--protocol sftp --direction UPLOAD --host sftp.fastcapture.bluetab.net --user sandoz_m9 --pass **** --from /interfaces/TMP/ventas0060202659_20201022.xls --to /input --comment /home/p01adm/sapsend",
					"comment": "/home/p01adm/sapsend",
					"protocolo": "SFTP",
					"sentidoTransmision": "UPLOAD",
					"hostLocal": "sap6p01",
					"osUser": "p01adm",
					"workingDir": "/usr/sap/P01/D16/work",
					"hostDestino": "sftp.fastcapture.bluetab.net",
					"puertoDestino": 0,
					"usuario": "sandoz_m9",
					"ficheroOrigen": "/interfaces/TMP/ventas0060202659_20201022.xls",
					"ficheroDestino": "/input",
					"codigoRetorno": 0,
					"claseError": null,
					"mensajeError": null,
					"bytesTransferidos": -1,
					"milisegundosTranscurridos": -1
				}*/

		if (ejecutarConsulta) {
			ejecutarConsulta({
				url: '/consulta',
				method: 'POST',
				body: {
					"filtro": filtro,
					"orden": { "timestamp": -1 }
				}
			});
		}
	}, [refFormulario, ejecutarConsulta]);


	useEffect(() => {
		realizarLlamadaAPI();
	}, [realizarLlamadaAPI]);

	let formulario = <Formulario referencia={refFormulario} onFiltroCambiado={realizarLlamadaAPI} />;
	let contenido = null;

	if (!resultado || resultado.cargando) {
		contenido = "CARGANDO ..."
	} else if (resultado.error || !resultado.datos?.ok) {
		contenido = <div>ERR</div>
	} else {
		let datos = resultado.datos?.datos || null;
		let filas = datos?.resultados?.map((transfer, i) => <Transferencia key={i} datos={transfer} />);
		contenido = <>
			<div>{datos.limite}</div>
			<div>{datos.skip}</div>
			<div>{datos.total}</div>
			{filas}
		</>


	}


	return <Container className="App">
		{formulario}
		{contenido}
	</Container>

}





export default App;
