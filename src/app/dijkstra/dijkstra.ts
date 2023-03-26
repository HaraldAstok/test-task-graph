type Edge = { node: string; weight: number };

type Graph = { [key: string]: Edge[] };

type ShortestPath = { path: string[]; distance: number };

export async function dijkstra(
	graph: Graph,
	startNode: string,
	endNode: string
): Promise<ShortestPath> {
	const distances: { [key: string]: number } = {};
	const previousNodes: { [key: string]: string[] } = {};
	const visited: { [key: string]: boolean } = {};

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
			} else if (distance === distances[neighbor.node]) {
				previousNodes[neighbor.node].push(currentNode);
			}
		}
	}

	// Collect all possible shortest paths from the end node to the start node
	let shortestPath;

	function collectShortestPaths(node: string, path: string[]) {
		if (node === startNode) {
			path = [...path, node];
			shortestPath = { path: path.reverse() };
		} else {
			for (let previousNode of previousNodes[node]) {
				collectShortestPaths(previousNode, [...path, node]);
			}
		}
	}
	collectShortestPaths(endNode, []);
	let distance: number = 0;

	for (let i = 1; i < shortestPath.path.length; i++) {
		const node = shortestPath.path[i - 1];
		const target = shortestPath.path[i];
		const distanceToTarget = getDistances(node, target, graph[node]);
		distance += distanceToTarget;
	}
	return { ...shortestPath, distance: Math.round(distance) };
}

function getDistances(node: string, target: string, graph: Edge[]): number {
	const edge = graph.find((edge) => edge.node === target);
	return edge!.weight;
}
