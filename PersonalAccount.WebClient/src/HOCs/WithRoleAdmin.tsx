import React, {FC, ReactNode} from 'react';
import {useAppSelector} from '../store/store';
import {Role} from '../modules/users/users.types';

type Props = {
    children?: ReactNode,
    render: ReactNode,
};

export const WithRoleAdmin: FC<Props> = ({children, render}) => {
    const me = useAppSelector(s => s.auth.me);

    if (me?.user.role === Role.Admin)
        return (<>{children}</>);

    return <>{render}</>;
};
