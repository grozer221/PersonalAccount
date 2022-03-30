import {Epic, ofType} from 'redux-observable';
import {switchMap} from 'rxjs';
import {client} from '../../gql/client';
import {notificationsActions} from './notifications.slice';
import {GET_MY_NOTIFICATIONS_QUERY, GetMyNotificationsData, GetMyNotificationsVars} from './notifications.queries';
import {RootState} from '../../store/store';

type FetchNotificationsAction = ReturnType<typeof notificationsActions.fetchNotifications>;
type FetchNotificationsEpicType = Epic<FetchNotificationsAction, any, RootState>;

export const fetchNotificationsEpic: FetchNotificationsEpicType = (action$) => action$.pipe(
    ofType('auth/loginStart'),
    switchMap(
        action => {
            return client.query<GetMyNotificationsData, GetMyNotificationsVars>({
                query: GET_MY_NOTIFICATIONS_QUERY,
                variables: {page: action.payload.page},
            })
                .then(response => notificationsActions.addNotifications(response.data.getMyNotifications))
                .catch(error => notificationsActions.setError(error.message));
        },
    ),
);

export default [fetchNotificationsEpic];
