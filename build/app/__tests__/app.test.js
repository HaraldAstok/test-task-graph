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
const request = require("supertest");
const index_1 = require("../index");
const TIMEOUT = 10000;
let server;
describe('server', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        server = yield (0, index_1.createApp)();
    }));
    describe('shortest route', () => {
        it('correctly routes from TLL to SFO', () => __awaiter(void 0, void 0, void 0, function* () {
            // https://www.greatcirclemap.com/?routes=TLL-TRD-KEF-YEG-SFO%2C%20TLL-ARN-OAK-SFO
            const response = yield request(server).get('/routes/TLL/SFO');
            const body = response.body;
            expect(body.distance).toBeWithin(8990, 9030);
            expect(body).toEqual(expect.objectContaining({
                source: 'TLL',
                destination: 'SFO',
            }));
            // There are multiple acceptable hop sequences, check for either
            expect([
                ['TLL', 'TRD', 'KEF', 'YEG', 'SFO'],
                ['TLL', 'ARN', 'OAK', 'SFO'],
            ]).toContain(body.hops);
        }), TIMEOUT);
        it('correctly routes from HAV to TAY', () => __awaiter(void 0, void 0, void 0, function* () {
            // https://www.greatcirclemap.com/?routes=%20HAV-NAS-JFK-HEL-TAY
            const response = yield request(server).get('/routes/HAV/TAY');
            const body = response.body;
            expect(body.distance).toBeWithin(9180, 9200);
            expect(body).toEqual(expect.objectContaining({
                source: 'HAV',
                destination: 'TAY',
                hops: ['HAV', 'NAS', 'JFK', 'HEL', 'TAY'],
            }));
        }), TIMEOUT);
    });
    describe('routes extended via ground', () => {
        it('correctly routes from TLL to LHR', () => __awaiter(void 0, void 0, void 0, function* () {
            // https://www.greatcirclemap.com/?routes=TLL-STN-LHR
            const response = yield request(server).get('/routes/TLL/LHR');
            const body = response.body;
            expect(body.distance).toBeWithin(1810, 1820);
            expect(body).toEqual(expect.objectContaining({
                source: 'TLL',
                destination: 'LHR',
                hops: ['TLL', 'STN', 'LHR'],
            }));
        }), TIMEOUT);
    });
});
