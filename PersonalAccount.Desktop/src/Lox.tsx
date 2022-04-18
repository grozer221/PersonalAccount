import React from 'react';
import {FC} from 'react';

type Props = {
    name: string
}

export const Lox: FC<Props> = (props) => {
    return (
        <div>
            {props.name}
        </div>
    );
};
