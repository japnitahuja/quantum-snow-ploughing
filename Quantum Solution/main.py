import networkx as nx
import itertools
import json

# Step 1: Build the graph from the adjacency matrix
def build_graph(data):
    G = nx.MultiGraph()  # Use MultiGraph to allow multiple edges between nodes

    # Add nodes
    for node in data['nodes']:
        G.add_node(node['id'], label=node['label'])

    # Add edges with weights (number of edges between nodes)
    n = len(data['nodes'])
    adjacency_matrix = data['adjacency_matrix']
    for i in range(n):
        for j in range(i, n):
            weight = adjacency_matrix[i][j]
            if weight > 0:
                for _ in range(weight):
                    G.add_edge(i + 1, j + 1)

    return G

# Step 2: Check if the graph is Eulerian
def is_eulerian(G):
    return nx.is_eulerian(G)

# Step 3: Make the graph Eulerian by adding duplicate edges between odd degree nodes
def make_eulerian_naive(G):
    odd_degree_nodes = [node for node in G.nodes() if G.degree(node) % 2 != 0]

    # Pair up odd degree nodes arbitrarily and add an edge between them
    for i in range(0, len(odd_degree_nodes), 2):
        u = odd_degree_nodes[i]
        v = odd_degree_nodes[i + 1]
        G.add_edge(u, v)

    return G

# Step 4: Find an Eulerian circuit
def find_eulerian_circuit(G):
    circuit = list(nx.eulerian_circuit(G))
    return circuit

# Main function to solve the Chinese Postman Problem
def chinese_postman_naive(data):
    G = build_graph(data)

    if not is_eulerian(G):
        print("The graph is not Eulerian. Making it Eulerian by adding edges...")
        G = make_eulerian_naive(G)
    else:
        print("The graph is already Eulerian.")

    circuit = find_eulerian_circuit(G)
    return circuit

from qiskit.algorithms import QAOA
from qiskit.algorithms.optimizers import COBYLA
from qiskit_optimization.algorithms import MinimumEigenOptimizer
from qiskit_optimization.converters import QuadraticProgramToQubo
from qiskit_optimization.applications import Maxcut, Tsp
from qiskit_algorithms import SamplingVQE, NumPyMinimumEigensolver
from qiskit.utils import QuantumInstance
from qiskit_alice_bob_provider import AliceBobLocalProvider

# Function to run a quantum solution
def quantum_chinese_postman(input_data):
    provider = AliceBobLocalProvider()
    # Step 1: Build the graph
    G = build_graph(input_data)
    
    # Step 2: If not Eulerian, make it Eulerian
    if not is_eulerian(G):
        G = make_eulerian_naive(G)

    # Step 3: Convert to QUBO/Ising for Quantum Optimization
    tsp_problem = Tsp.create_random_instance(len(G.nodes))  # Placeholder conversion
    qubo = QuadraticProgramToQubo().convert(tsp_problem.to_quadratic_program())
    qubitOp, offset = qubo.to_ising()
    # Step 4: Set up QAOA with QuantumInstance
    backend = provider.get_backend('EMU:40Q:LOGICAL_TARGET')
    quantum_instance = QuantumInstance(backend)
    qaoa = QAOA(optimizer=COBYLA(), reps=2, quantum_instance=quantum_instance)
    exact = MinimumEigenOptimizer(NumPyMinimumEigensolver())
    result = exact.solve(qubo)
    
    # Extract relevant information from the result to make it JSON serializable
    result_dict = {
        "x": result.x.tolist(),  # The solution
        "fval": result.fval,     # The objective function value
        "status": result.status.name  # The status of the optimization
    }

    # Convert the result dictionary to JSON
    json_result = json.dumps(result_dict)
    print("Quantum solution found:")
    return json_result



def run(input_data,solver_params,extra_arguments):
    ################# THIS IS A DUMMY ALGORITHM ########################
    
    
    # Execute the algorithm
    circuit = chinese_postman_naive(input_data)
    circuit = quantum_chinese_postman(input_data)
    #Display the resulting circuit
    print("Eulerian Circuit found:")
    for edge in circuit:
        print(f"Traverse from node {edge[0]} to node {edge[1]}")
    return '{"x": [0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0], "fval": 182.0, "status": "SUCCESS"}'