import { useRef, useState } from 'react';
import { Button, Collapse, Card, Col, Form, Row } from 'react-bootstrap';
import { SelectorFechas } from './SelectorFechas';
import { RiFilterLine } from 'react-icons/ri';

export const Formulario = ({referencia, onFiltroCambiado}) => {

	const [open, setOpen] = useState(false);


	referencia.current = {
		timestamp: useRef({ from: new Date(), to: new Date() }),
		sentidoTransmision: useRef(null),
		protocolo: useRef(null),
		hostLocal: useRef(null),
		hostDestino: useRef(null),
		codigoRetorno: useRef(null),
		comentario: useRef(null)
	};
	

	return <Card className={`my-3 p-4 py-1`}>
		<Button className="mb-2" onClick={() => setOpen(!open)} variant="outline-primary">
			<RiFilterLine />{open ? 'Ocultar' : 'Mostrar'} filtros
		</Button>

		<Collapse in={open}>
			<Form className="pt-2">
				<Row>
					<Col lg={6}>
						<SelectorFechas referencia={referencia.current.timestamp} />
						<Form.Group>
							<Form.Label>Resultado de la transferencia</Form.Label>
							<Form.Control as="select" ref={referencia.current.codigoRetorno}>
								<option value="">-- Mostrar todas --</option>
								<option value="ERR">Mostrar solo trasnferencias con errores</option>
								<option value="NOERR">Mostrar transferencias sin error</option>
							</Form.Control>
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group>
							<Form.Label>Sentido de transferencia</Form.Label>
							<Form.Control as="select" ref={referencia.current.sentidoTransmision}>
								<option value="">-- Todos --</option>
								<option value="UPLOAD">Subida</option>
								<option value="DOWNLOAD">Bajada</option>
							</Form.Control>
						</Form.Group>

						<Form.Group>
							<Form.Label>Protocolo de transferencia</Form.Label>
							<Form.Control as="select" ref={referencia.current.protocolo}>
								<option value="">-- Todos --</option>
								<option value="FTP">FTP</option>
								<option value="SFTP">SFTP</option>
								<option value="FTPS">FTPS</option>
								<option value="SCP">SCP</option>
								<option value="SMB">SMB</option>
							</Form.Control>
						</Form.Group>

						<Form.Group>
							<Form.Label>Host local</Form.Label>
							<Form.Control type="text" placeholder="" ref={referencia.current.hostLocal}/>
						</Form.Group>

						<Form.Group >
							<Form.Label>Host remoto</Form.Label>
							<Form.Control type="text" placeholder="" ref={referencia.current.hostDestino}/>
						</Form.Group>

						<Form.Group >
							<Form.Label>Comentario</Form.Label>
							<Form.Control type="text" placeholder="" ref={referencia.current.comentario} />
						</Form.Group>

					</Col>
				</Row>

				<Row>
					<Col className="text-center">
						<Button size="lg" variant="success" onClick={onFiltroCambiado}>Aplicar</Button>
					</Col>
				</Row>
			</Form>
		</Collapse>
	</Card>
}