import DayPicker, { DateUtils } from 'react-day-picker';
import Helmet from 'react-helmet';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import 'react-day-picker/lib/style.css';

import MomentLocaleUtils from 'react-day-picker/moment';

import 'moment/locale/es';
import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';

const BadgeFecha = ({ fecha }) => {
	return <Badge variant="primary" className="font-weight-normal" style={{
		fontSize: '90 %',
		padding: '4px 7px 5px 7px'
	}}>{fecha.toLocaleDateString()}</Badge>
}

export const SelectorFechas = ({ referencia }) => {


	let [rango, _setRango] = useState({ from: moment().startOf('day').toDate(), to: moment().endOf('day').toDate() });
	let { from, to } = rango;

	const setRango = useCallback((nuevoRango) => {

		let fromNormalizado = (nuevoRango.from && isNaN(nuevoRango.from.getTime())) ? null : nuevoRango.from;
		let toNormalizado = (nuevoRango.to && isNaN(nuevoRango.to.getTime())) ? null : nuevoRango.to;

		let rangoNormalizado = {
			from: fromNormalizado ? moment(fromNormalizado).startOf('day').toDate() : null,
			to: toNormalizado ? moment(toNormalizado).endOf('day').toDate() : null
		}

		referencia.current = rangoNormalizado;
		_setRango(rangoNormalizado);
	}, [referencia, _setRango]);



	const agregarDiaAlRango = useCallback((day) => {
		const nuevoRango = DateUtils.addDayToRange(day, rango);
		setRango(nuevoRango);
	}, [rango, setRango])

	const setRangoHoy = useCallback(() => {
		setRango({ from: new Date(), to: new Date() });
	}, [setRango])


	const setRangoAyer = useCallback(() => {
		let ayer = moment().subtract(1, 'days').toDate();
		setRango({ from: ayer, to: ayer });
	}, [setRango])



	const setRango7dias = useCallback(() => {
		let semana = moment().subtract(6, 'days').toDate();
		setRango({ from: semana, to: new Date() });
	}, [setRango])

	const setRango30dias = useCallback(() => {
		let mes = moment().subtract(1, 'month').add(1, 'days').toDate();
		setRango({ from: mes, to: new Date() });
	}, [setRango])


	useEffect(() => {
		setRangoHoy();
	}, [setRangoHoy, referencia])

	/////////////////////////////////////////////////////////////////

	let label = 'Selecciona al menos un día';

	if (from && !to) {
		label = <>Seleccionado el <BadgeFecha fecha={from} /></>;
	} else if (!from && to) {
		label = <>Seleccionado el <BadgeFecha fecha={to} /></>;
	} else if (from && to) {
		if (from.getTime() === to.getTime()) {
			label = <>Seleccionado el <BadgeFecha fecha={to} /></>;
		} else {
			label = <>Seleccionado del <BadgeFecha fecha={from} /> al <BadgeFecha fecha={to} /></>;
		}
	}




	return <Card className="mb-4">

		<Row >
			<Col className="text-center my-3">
				{label}
			</Col>
		</Row>

		<DayPicker
			className="Selectable"
			numberOfMonths={2}
			selectedDays={[from, { from, to }]}
			modifiers={{ start: from, end: to }}
			onDayClick={agregarDiaAlRango}
			locale="es"
			localeUtils={MomentLocaleUtils}
			fromMonth={new Date(2020, 10 - 1)} // No hay datos anteriores a Octubre
			toMonth={new Date()}
		/>

		<Row>
			<Col className="text-center mt-0 mb-3">
				<Button size="sm" variant="outline-primary" className="mx-1" onClick={setRangoHoy}>Hoy</Button>
				<Button size="sm" variant="outline-primary" className="mx-1" onClick={setRangoAyer}>Ayer</Button>
				<Button size="sm" variant="outline-primary" className="mx-1" onClick={setRango7dias}>Última semana</Button>
				<Button size="sm" variant="outline-primary" className="mx-1" onClick={setRango30dias}>Último mes</Button>
			</Col>
		</Row>


		<Helmet>
			<style>{`
				.Selectable .DayPicker-Caption {
				    text-align: center!important;
				}
				.Selectable .DayPicker-NavButton {
					right: 2em;
					top: -0.2em;
				}
				.Selectable .DayPicker-Month {
					margin-top: 0px;
					margin-bottom: 1em;
				}
				.Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
					background-color: #f0f8ff !important;
					color: #4a90e2;
				}
				.Selectable .DayPicker-Day {
					border-radius: 0 !important;
					padding: 0px 0px 1px 1px;
				}
				.Selectable .DayPicker-Day--start {
					border-top-left-radius: 50% !important;
					border-bottom-left-radius: 50% !important;
				}
				.Selectable .DayPicker-Day--end {
					border-top-right-radius: 50% !important;
					border-bottom-right-radius: 50% !important;
				}
			`}</style>
		</Helmet>

	</Card>

	/*
		return <DayPickerInput
			formatDate={formatDate}
			parseDate={parseDate}
			format="LL"
			placeholder={`${formatDate(new Date(), 'LL', 'es')}`}
			dayPickerProps={{
				locale: 'es',
				localeUtils: MomentLocaleUtils,
			}}
		/>
	*/



}