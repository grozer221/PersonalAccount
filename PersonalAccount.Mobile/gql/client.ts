import {ApolloClient, ApolloLink, concat, HttpLink, InMemoryCache, split} from '@apollo/client';
import {schema} from './schema';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import {getToken} from '../utils/asyncStorageUtils';

export const host = 'ztu-personal-account.herokuapp.com/graphql';

const authMiddleware = new ApolloLink((operation, forward) => {
    getToken().then(token => {
        console.log('token', token);
        operation.setContext(({headers = {}}) => ({
            headers: {
                ...headers,
                authorization: `Bearer ${token}`,
            },
        }));
    });
    return forward(operation);
});

const httpLink = new HttpLink({uri: `https://${host}`});

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
    concat(authMiddleware, httpLink),
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
