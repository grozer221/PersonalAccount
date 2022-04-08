import React, {FC, ReactNode} from 'react';
import {useAppSelector} from '../store/store';

type Props = {
    render: ReactNode,
};

export const WithAuth: FC<Props> = ({children, render}) => {
    const isAuth = useAppSelector(s => s.auth.isAuth);

    if (isAuth)
        return (<>{children}</>);

    return <>{render}</>;
};
