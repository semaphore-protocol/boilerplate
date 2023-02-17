## Building subgraphs locally

This is a guide to run TheGraph node locally and build subgraphs based on events from local hardhat network.

<br/>

Start services required for TheGraph node by running

```sh
docker-compose -f docker-compose-graph.yml up
```

Start local hardhat node

```sh
npx hardhat node
```

This would run the hardhat node and connects that to TheGraph node (assuming default ports are used). The local hardhat node is named as `goerli` for TheGraph and this network name should be used in the subgraph config.

Deploy the contracts to local hardhat node

```sh
cd apps/contracts
yarn deploy --network localhost
```

You can now set the deployed contract address in the subgraph.yaml file. Make sure the network is set as `goerli`.

Once subgraph is ready to be published, run the below command to push it to the local TheGraph node

```sh
yarn deploy-local
```

Once the subgraph is published it will start indexing. You can query the subgraph using the GraphQL endpoint:

```
http://127.0.0.1:8000/subgraphs/name/semaphore-boilerplate/graphql
```
