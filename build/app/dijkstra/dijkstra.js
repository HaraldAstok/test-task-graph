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
exports.dijkstra = void 0;
function dijkstra(graph, startNode, endNode) {
    return __awaiter(this, void 0, void 0, function* () {
        const distances = {};
        const previousNodes = {};
        const visited = {};
        // Initialize the distances and previous nodes
        for (let node in graph) {
            distances[node] = Infinity;
            previousNodes[node] = [startNode];
        }
        distances[startNode] = 0;
        // Visit each node in the graph
        for (let i = 0; i < Object.keys(graph).length; i++) {
            let currentNode = Object.keys(graph)[i];
            if (currentNode === null) {
                break;
            }
            visited[currentNode] = true;
            // Update distances and previous nodes for neighboring nodes
            for (let neighbor of graph[currentNode]) {
                const distance = distances[currentNode] + neighbor.weight;
                if (distance < distances[neighbor.node]) {
                    distances[neighbor.node] = distance;
                    previousNodes[neighbor.node] = [currentNode];
                }
                else if (distance === distances[neighbor.node]) {
                    previousNodes[neighbor.node].push(currentNode);
                }
            }
        }
        // Collect all possible shortest paths from the end node to the start node
        let shortestPath;
        function collectShortestPaths(node, path) {
            if (node === startNode) {
                path = [...path, node];
                shortestPath = { path: path.reverse() };
            }
            else {
                for (let previousNode of previousNodes[node]) {
                    collectShortestPaths(previousNode, [...path, node]);
                }
            }
        }
        collectShortestPaths(endNode, []);
        let distance = 0;
        for (let i = 1; i < shortestPath.path.length; i++) {
            const node = shortestPath.path[i - 1];
            const target = shortestPath.path[i];
            const distanceToTarget = getDistances(node, target, graph[node]);
            distance += distanceToTarget;
        }
        return Object.assign(Object.assign({}, shortestPath), { distance: Math.round(distance) });
    });
}
exports.dijkstra = dijkstra;
function getDistances(node, target, graph) {
    const edge = graph.find((edge) => edge.node === target);
    return edge.weight;
}
