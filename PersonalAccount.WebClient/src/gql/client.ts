import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from '@apollo/client';
import {schema} from './schema';
import {localStorageUtils} from '../utills/localStorageUtils';

const authMiddleware = new ApolloLink((operation, forward) => {
    const token = localStorageUtils.getToken();
    operation.setContext(({headers = {}}) => ({
        headers: {
            ...headers,
            authorization: `Bearer ${token}`,
        },
    }));
    return forward(operation);
});

const httpLink = new HttpLink({uri: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? `https://localhost:7210/graphql` : `./graphql`});

export const client = new ApolloClient({
    link: authMiddleware.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
            notifyOnNetworkStatusChange: true,
        },
        query: {
            errorPolicy: 'all',
            notifyOnNetworkStatusChange: true,
        },
    },
    typeDefs: schema,
});
