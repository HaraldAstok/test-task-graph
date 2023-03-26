"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express = require("express");
const morgan = require("morgan");
const util_1 = require("../util");
const data_1 = require("../data");
const dijkstra_1 = require("./dijkstra/dijkstra");
function createApp() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = express();
        const airports = yield (0, data_1.loadAirportData)();
        const airportsByCode = new Map((0, util_1.flatten)(airports.map((airport) => [
            airport.iata !== null
                ? [airport.iata.toLowerCase(), airport]
                : null,
            airport.icao !== null
                ? [airport.icao.toLowerCase(), airport]
                : null,
        ].filter(util_1.notNil))));
        const routes = yield (0, data_1.loadRouteData)();
        const routesGraph = yield (0, data_1.createGraph)(routes);
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
        app.get('/routes/:source/:destination', (req, res) => __awaiter(this, void 0, void 0, function* () {
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
            const path = yield (0, dijkstra_1.dijkstra)(routesGraph, sourceAirport.id, destinationAirport.id);
            const pahtCodes = path.path.map((id) => {
                const airport = airports.find((airport) => airport.id === id);
                return airport.iata;
            });
            return res.status(200).send({
                source,
                destination,
                distance: path.distance,
                hops: pahtCodes,
            });
        }));
        return app;
    });
}
exports.createApp = createApp;
