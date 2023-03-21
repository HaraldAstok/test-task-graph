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
function createApp() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = express();
        const airports = yield (0, data_1.loadAirportData)();
        const airportsByCode = new Map((0, util_1.flatten)(airports.map((airport) => [
            airport.iata !== null ? [airport.iata.toLowerCase(), airport] : null,
            airport.icao !== null ? [airport.icao.toLowerCase(), airport] : null,
        ].filter(util_1.notNil))));
        console.log('AIRPORTS ->', airportsByCode);
        app.use(morgan('tiny'));
        app.get('/health', (_, res) => res.send('OK'));
        app.get('/airports/:code', (req, res) => {
            const code = req.params['code'];
            if (code === undefined) {
                return res.status(400).send('Must provide airport code');
            }
            const airport = airportsByCode.get(code.toLowerCase());
            if (airport === undefined) {
                return res.status(404).send('No such airport, please provide a valid IATA/ICAO code');
            }
            return res.status(200).send(airport);
        });
        app.get('/routes/:source/:destination', (req, res) => {
            const source = req.params['source'];
            const destination = req.params['destination'];
            if (source === undefined || destination === undefined) {
                return res.status(400).send('Must provide source and destination airports');
            }
            const sourceAirport = airportsByCode.get(source.toLowerCase());
            const destinationAirport = airportsByCode.get(destination.toLowerCase());
            if (sourceAirport === undefined || destinationAirport === undefined) {
                return res.status(404).send('No such airport, please provide a valid IATA/ICAO codes');
            }
            // TODO: Figure out the route from source to destination
            console.log('No algorithm implemented');
            return res.status(200).send({
                source,
                destination,
                distance: 0,
                hops: [],
            });
        });
        return app;
    });
}
exports.createApp = createApp;
