import { Card, Badge, Col, Row } from 'react-bootstrap';


export const Caja = ({ local, host, puerto, usuario, path, cwd, comentario }) => {

	return <Card className="px-4 py-3 m-0">


		< Row  >
			<Col sm="auto" >
				<Badge variant="info" className="p-1 font-weight-normal text-monospace">{usuario}</Badge>
				<Badge variant="dark-outline" className="p-1 py-2"> @ </Badge>
				<Badge variant="primary" className="p-1  font-weight-normal  text-monospace">{host}{puerto > 0 && <>:{puerto}</>}</Badge>
			</Col>
		</Row >
		<Row className="my-1">
			<Col sm="auto" className="text-monospace">
				<code>{path}</code>

				{cwd && cwd !== '/' &&
					<>
						<br />
						<small>
							(<b>cwd: </b>{cwd})
								</small>
					</>
				}
			</Col>

		</Row>
		{comentario &&
			<Row>
				<Col sm="auto" className="text-monospace">
					<Badge variant="dark" className="p-1 px-2">{comentario}</Badge>
				</Col>

			</Row>
		}
	</Card>

}

export const CajaSentido = ({ sentido, protocolo }) => {

	if (!sentido) sentido = "upload";
	else sentido = sentido.toLowerCase();

	let foto = require(`img/${sentido}.png`);

	return <Row style={{
		backgroundImage: 'url(' + foto.default + ')',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		width: '100px',
		height: '90px'
	}} className="font-weight-bold d-flex align-items-center text-monospace">
		<Col sm={12} className="text-center" >{protocolo}</Col>
	</Row>



}

