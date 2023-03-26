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
exports.createGraph = exports.loadRouteData = exports.loadAirportData = void 0;
const parse = require("csv-parse");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("../util");
function parseCSV(filePath, columns) {
    return new Promise((resolve, reject) => {
        (0, fs_1.readFile)(filePath, (err, data) => {
            if (err) {
                return reject(err);
            }
            parse(data, {
                columns: Array.from(columns),
                skip_empty_lines: true,
                relax_column_count: true,
            }, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    });
}
function loadAirportData() {
    return __awaiter(this, void 0, void 0, function* () {
        const columns = [
            'airportID',
            'name',
            'city',
            'country',
            'iata',
            'icao',
            'latitude',
            'longitude',
        ];
        const rows = yield parseCSV((0, path_1.resolve)(__dirname, './airports.dat'), columns);
        return rows.map((row) => ({
            id: row.airportID,
            icao: row.icao === '\\N' ? null : row.icao,
            iata: row.iata === '\\N' ? null : row.iata,
            name: row.name,
            location: {
                latitude: Number(row.latitude),
                longitude: Number(row.longitude),
            },
        }));
    });
}
exports.loadAirportData = loadAirportData;
function loadRouteData() {
    return __awaiter(this, void 0, void 0, function* () {
        const airports = yield loadAirportData();
        const airportsById = new Map(airports.map((airport) => [airport.id, airport]));
        const columns = [
            'airline',
            'airlineID',
            'source',
            'sourceID',
            'destination',
            'destinationID',
            'codeshare',
            'stops',
        ];
        const rows = yield parseCSV((0, path_1.resolve)(__dirname, './routes.dat'), columns);
        return rows
            .filter((row) => row.stops === '0')
            .map((row) => {
            const source = airportsById.get(row.sourceID);
            const destination = airportsById.get(row.destinationID);
            if (source === undefined || destination === undefined) {
                return null;
            }
            return {
                source,
                destination,
                distance: (0, util_1.haversine)(source.location.latitude, source.location.longitude, destination.location.latitude, destination.location.longitude),
            };
        })
            .filter(util_1.notNil);
    });
}
exports.loadRouteData = loadRouteData;
function createGraph(routes) {
    return __awaiter(this, void 0, void 0, function* () {
        const graph = {};
        for (let route of routes) {
            const startNode = route.source.id;
            const destinationNode = route.destination.id;
            const distance = route.distance;
            const startValues = { node: destinationNode, weight: distance };
            const destinationValues = { node: startNode, weight: distance };
            if (!(startNode in graph)) {
                graph[startNode] = [startValues];
            }
            else if (!graph[startNode].some((elem) => elem.node === startValues.node && elem.weight === startValues.weight)) {
                const nodeValues = graph[startNode];
                nodeValues.push(startValues);
                graph[startNode] = nodeValues;
            }
            if (!(destinationNode in graph)) {
                graph[destinationNode] = [destinationValues];
            }
            else if (!graph[destinationNode].some((elem) => elem.node === destinationValues.node &&
                elem.weight === destinationValues.weight)) {
                const nodeValues = graph[destinationNode];
                nodeValues.push(destinationValues);
                graph[destinationNode] = nodeValues;
            }
        }
        return graph;
    });
}
exports.createGraph = createGraph;
