import { Alert, Card, Col, Row } from 'react-bootstrap';
import { Caja, CajaSentido } from 'transferencias/Caja';

const pad = (num) => {
	let s = "00" + num;
	return s.substr(s.length - 2, 2);
}


export const Transferencia = ({ datos }) => {

	let ficheroLocal = (datos.sentidoTransmision === 'DOWNLOAD') ? datos.ficheroDestino : datos.ficheroOrigen;
	let ficheroRemoto = (datos.sentidoTransmision === 'DOWNLOAD') ? datos.ficheroOrigen : datos.ficheroDestino;

	let fecha = new Date();
	fecha.setTime(datos.timestamp);


	return <div className={`mt-0 p-4 py-1 border-bottom ${datos.codigoRetorno !== 0 && ' bg-danger-soft border-danger'}`}>
		<Row className="mb-2">
			<Col sm={6} className="text-small text-monospace">

				<span  >
					{pad(fecha.getDate())}/{pad(fecha.getMonth() + 1)}/{fecha.getFullYear()} {pad(fecha.getHours())}:{pad(fecha.getMinutes())}:{pad(fecha.getSeconds())}
				</span>
			</Col>

			<Col sm={6} className="text-small text-monospace text-mutted text-right">
				<span >
					{datos._id}
				</span>
			</Col>
		</Row>

		<Row className="no-gutters">
			<Col sm={5}>
				<Caja local host={datos.hostLocal} usuario={datos.osUser} path={ficheroLocal} cwd={datos.workingDir} comentario={datos.comment} />
			</Col>

			<Col sm={2} className="py-2 my-1 d-flex justify-content-center">
				<CajaSentido sentido={datos.sentidoTransmision} protocolo={datos.protocolo} />
			</Col>

			<Col sm={5} >
				<Caja remoto host={datos.hostDestino} puerto={datos.puertoDestino} usuario={datos.usuario} path={ficheroRemoto} />
			</Col>
		</Row>

		{datos.codigoRetorno !== 0 &&
			<Alert variant="danger" className="text-monospace py-1 mt-2 mb-0">
				<code className="text-right text-mutted float-right"><small>{datos.claseError}</small></code>
				<div className="font-weight-bold">Código de retorno: <b>{datos.codigoRetorno}</b></div>
				<div><small>{datos.mensajeError}</small></div>
				<div className="bg-light my-1 py-1 px-3  rounded ">
					<small>
						<code>
							{datos.argumentos}
						</code>
					</small>
				</div>
			</Alert>
		}

	</div>

}

export default Transferencia;
