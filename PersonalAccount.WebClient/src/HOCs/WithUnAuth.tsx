import React, {FC, ReactNode} from 'react';
import {useAppSelector} from '../store/store';

type Props = {
    children?: ReactNode,
    render: ReactNode,
};

export const WithUnAuth: FC<Props> = ({children, render}) => {
    const isAuth = useAppSelector(s => s.auth.isAuth);

    if (!isAuth)
        return (<>{children}</>);

    return <>{render}</>;
};
