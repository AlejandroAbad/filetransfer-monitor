import { useEffect } from 'react';
import { useApiCall } from './hooks/useApiCall';
import ReactJson from 'react-json-view';
import { Container } from 'react-bootstrap';
import { Transferencia } from 'transferencias/Transferencia'

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {

	let { resultado, ejecutarConsulta } = useApiCall();


	useEffect(() => {
		if (ejecutarConsulta) {
			ejecutarConsulta({
				url: '/consulta',
				method: 'POST',
				body: {
					"filtro": {
						"codigoRetorno" : {"$ne": 0}
					},
					"orden": {"timestamp": -1}
				}
			});
		}

	}, [ejecutarConsulta]);


	let formulario = <div>FORMULARIO</div>;
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
