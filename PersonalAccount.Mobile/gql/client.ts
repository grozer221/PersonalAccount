import {ApolloClient, HttpLink, InMemoryCache, split} from '@apollo/client';
import {schema} from './schema';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';

export const host = '10.0.2.2:44314/graphql';
console.log(host);
const httpLink = new HttpLink({
    uri: `https://${host}`,
    // headers: {
    //     authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
    // },
});

const wsLink = new WebSocketLink({
    uri: `wss://${host}`,
    options: {
        reconnect: true,
        // connectionParams: {
        //     authToken: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
        // },
    },
});

const splitLink = split(
    ({query}) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            // fetchPolicy: 'network-only',
            errorPolicy: 'all',
            notifyOnNetworkStatusChange: true,
        },
        query: {
            // fetchPolicy: 'network-only',
            errorPolicy: 'all',
            notifyOnNetworkStatusChange: true,
        },
    },
    typeDefs: schema,
});
