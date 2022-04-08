import {gql} from '@apollo/client';

export type BroadcastMessageData = { broadcastMessage: boolean }
export type BroadcastMessageVars = { message: string }

export const BROADCAST_MESSAGE_MUTATION = gql`
    mutation BroadcastMessage($message: String!) {
        broadcastMessage(message: $message)
    }
`;
