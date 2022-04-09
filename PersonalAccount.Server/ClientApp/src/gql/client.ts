import {ApolloClient, ApolloLink, HttpLink, InMemoryCache, split} from '@apollo/client';
import {schema} from './schema';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import {localStorageUtils} from '../utills/localStorageUtils';

// @ts-ignore
const authMiddleware = new ApolloLink((operation, forward) => {
    const token = localStorageUtils.getToken();
    console.log('override', token);
    operation.setContext(({headers = {}}) => ({
        headers: {
            ...headers,
            authorization: `Bearer ${token}`,
        },
    }));
    return forward(operation);
});

const httpLink = new HttpLink({uri: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? `https://localhost:7210/graphql` : `./graphql`});

const wsLink = new WebSocketLink({
    uri: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? `wss://localhost:7210/graphql` : `wss://${window.location.host}/graphql`,
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
    authMiddleware.concat(httpLink),
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
