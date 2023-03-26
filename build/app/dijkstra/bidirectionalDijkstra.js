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
        const shortestPaths = [];
        function collectShortestPaths(node, path, weightSoFar) {
            var _a, _b;
            if (node === startNode) {
                shortestPaths.push({ path: path.reverse(), weight: weightSoFar });
            }
            else {
                for (let previousNode of previousNodes[node]) {
                    const previousWeight = (_b = (_a = graph[previousNode].find((edge) => edge.node === node)) === null || _a === void 0 ? void 0 : _a.weight) !== null && _b !== void 0 ? _b : Infinity;
                    collectShortestPaths(previousNode, [...path, node], weightSoFar + previousWeight);
                }
            }
        }
        collectShortestPaths(endNode, [], distances[endNode]);
        return shortestPaths;
    });
}
exports.dijkstra = dijkstra;
// class PriorityQueue<T> {
// 	private items: { element: T; priority: number }[];
// 	constructor() {
// 		this.items = [];
// 	}
// 	getIterator() {
// 		return this.items[Symbol.iterator]();
// 	}
// 	enqueue(element: T, priority: number) {
// 		const queueElement = { element, priority };
// 		let added = false;
// 		for (let i = 0; i < this.items.length; i++) {
// 			if (queueElement.priority < this.items[i].priority) {
// 				this.items.splice(i, 0, queueElement);
// 				added = true;
// 				break;
// 			}
// 		}
// 		if (!added) {
// 			this.items.push(queueElement);
// 		}
// 	}
// 	dequeue() {
// 		if (this.isEmpty()) {
// 			return null;
// 		}
// 		return this.items.shift()!;
// 	}
// 	front() {
// 		if (this.isEmpty()) {
// 			return null;
// 		}
// 		return this.items[0];
// 	}
// 	isEmpty() {
// 		return this.items.length === 0;
// 	}
// 	size() {
// 		return this.items.length;
// 	}
// 	print() {
// 		console.log(this.items);
// 	}
// }
// type Graph = { [key: string]: { node: string; weight: number }[] };
// export async function dijkstra(
// 	graph: Graph,
// 	start: string,
// 	end: string,
// 	maxNodes: number
// ): Promise<{ path: string[]; distance: number } | null> {
// 	// Initialize distances and visited set
// 	const distances: { [key: string]: number } = {};
// 	const visited: { [key: string]: boolean } = {};
// 	const previous: { [key: string]: string | null } = {};
// 	const queue = new PriorityQueue<string>();
// 	for (const node in graph) {
// 		distances[node] = Infinity;
// 		previous[node] = null;
// 	}
// 	distances[start] = 0;
// 	queue.enqueue(start, 0);
// 	// Dijkstra's algorithm
// 	while (!queue.isEmpty()) {
// 		const removedNode = queue.dequeue() as {
// 			element: string;
// 			priority: number;
// 		};
// 		if (visited[removedNode.element]) continue;
// 		visited[removedNode.element] = true;
// 		if (removedNode.element === end) {
// 			// Reconstruct shortest path
// 			const path = [];
// 			let currentNode = end;
// 			while (currentNode !== null) {
// 				path.unshift(currentNode);
// 				currentNode = previous[currentNode];
// 			}
// 			if (path.length <= maxNodes) {
// 				return { path, distance: distances[end] };
// 			} else {
// 				return null;
// 			}
// 		}
// 		for (const { node: neighbor, weight } of graph[removedNode.element]) {
// 			const tentativeDistance = distances[removedNode.element] + weight;
// 			if (tentativeDistance < distances[neighbor]) {
// 				distances[neighbor] = tentativeDistance;
// 				previous[neighbor] = removedNode.element;
// 				queue.enqueue(neighbor, tentativeDistance);
// 			}
// 		}
// 	}
// 	// If we get here, there's no path
// 	return null;
// }
//   export async function bidirectionalDijkstra(graph, start, end, maxNodes) {
// 	// Initialize forward and backward search
// 	let forwardVisited = new Set([start]);
// 	let backwardVisited = new Set([end]);
// 	let forwardDistances = new Map([[start, 0]]);
// 	let backwardDistances = new Map([[end, 0]]);
// 	let forwardQueue = [start];
// 	let backwardQueue = [end];
// 	// Initialize variables to track the shortest path
// 	let shortestPath = Infinity;
// 	let shortestPathNodes = [];
// 	// Iterate while both queues are not empty
// 	while (forwardQueue.length && backwardQueue.length) {
// 		// Check if maximum number of nodes have been visited
// 		if (forwardVisited.size + backwardVisited.size > maxNodes) {
// 			break;
// 		}
// 		// Perform forward search
// 		let currentForward = forwardQueue.shift();
// 		for (let neighbor of graph[currentForward]) {
// 			let tentativeDistance =
// 				forwardDistances.get(currentForward) + neighbor.weight;
// 			if (
// 				!forwardDistances.has(neighbor.node) ||
// 				tentativeDistance < forwardDistances.get(neighbor.node)
// 			) {
// 				forwardDistances.set(neighbor.node, tentativeDistance);
// 				if (!forwardVisited.has(neighbor.node)) {
// 					forwardVisited.add(neighbor.node);
// 					forwardQueue.push(neighbor.node);
// 				}
// 			}
// 		}
// 		// Perform backward search
// 		let currentBackward = backwardQueue.shift();
// 		for (let neighbor of graph[currentBackward]) {
// 			let tentativeDistance =
// 				backwardDistances.get(currentBackward) + neighbor.weight;
// 			if (
// 				!backwardDistances.has(neighbor.node) ||
// 				tentativeDistance < backwardDistances.get(neighbor.node)
// 			) {
// 				backwardDistances.set(neighbor.node, tentativeDistance);
// 				if (!backwardVisited.has(neighbor.node)) {
// 					backwardVisited.add(neighbor.node);
// 					backwardQueue.push(neighbor.node);
// 				}
// 			}
// 		}
// 		// Check for intersection of forward and backward search
// 		for (let node of forwardVisited) {
// 			if (backwardVisited.has(node)) {
// 				let distance = forwardDistances.get(node) + backwardDistances.get(node);
// 				if (distance < shortestPath) {
// 					shortestPath = distance;
// 					shortestPathNodes = [node];
// 				}
// 			}
// 		}
// 	}
// 	// Build shortest path
// 	let current = shortestPathNodes[0];
// 	let path = [current];
// 	let forwardPath = [current];
// 	while (current !== start) {
// 		for (let neighbor of graph[current]) {
// 			if (
// 				forwardDistances.get(neighbor.node) + neighbor.weight ===
// 				forwardDistances.get(current)
// 			) {
// 				current = neighbor.node;
// 				path.unshift(current);
// 				forwardPath.unshift(current);
// 				break;
// 			}
// 		}
// 	}
// 	current = shortestPathNodes[0];
// 	while (current !== end) {
// 		for (let neighbor of graph[current]) {
// 			if (
// 				backwardDistances.get(neighbor.node) + neighbor.weight ===
// 				backwardDistances.get(current)
// 			) {
// 				current = neighbor.node;
// 				path.push(current);
// 				break;
// 			}
// 		}
// 	}
// 	return path;
// }
