import * as express from 'express';
import * as morgan from 'morgan';

import { notNil, flatten } from '../util';
import { Airport, loadAirportData, loadRouteData, createGraph } from '../data';

import { dijkstra } from './dijkstra/dijkstra';

export async function createApp() {
	const app = express();

	const airports = await loadAirportData();
	const airportsByCode = new Map<string, Airport>(
		flatten(
			airports.map((airport) =>
				[
					airport.iata !== null
						? ([airport.iata.toLowerCase(), airport] as const)
						: null,
					airport.icao !== null
						? ([airport.icao.toLowerCase(), airport] as const)
						: null,
				].filter(notNil)
			)
		)
	);

	const routes = await loadRouteData();
	const routesGraph = await createGraph(routes);

	app.use(morgan('tiny'));

	app.get('/health', (_, res) => res.send('OK'));
	app.get('/airports/:code', (req, res) => {
		const code = req.params['code'];
		if (code === undefined) {
			return res.status(400).send('Must provide airport code');
		}

		const airport = airportsByCode.get(code.toLowerCase());
		if (airport === undefined) {
			return res
				.status(404)
				.send('No such airport, please provide a valid IATA/ICAO code');
		}

		return res.status(200).send(airport);
	});

	app.get('/routes/:source/:destination', async (req, res) => {
		const source = req.params['source'];
		const destination = req.params['destination'];
		if (source === undefined || destination === undefined) {
			return res
				.status(400)
				.send('Must provide source and destination airports');
		}

		const sourceAirport = airportsByCode.get(source.toLowerCase());
		const destinationAirport = airportsByCode.get(destination.toLowerCase());
		if (sourceAirport === undefined || destinationAirport === undefined) {
			return res
				.status(404)
				.send('No such airport, please provide a valid IATA/ICAO codes');
		}

		const path = await dijkstra(
			routesGraph,
			sourceAirport.id,
			destinationAirport.id
		);

		const pahtCodes = path.path.map((id) => {
			const airport = airports.find((airport) => airport.id === id);
			return airport!.iata;
		});

		return res.status(200).send({
			source,
			destination,
			distance: path.distance,
			hops: pahtCodes,
		});
	});

	return app;
}
