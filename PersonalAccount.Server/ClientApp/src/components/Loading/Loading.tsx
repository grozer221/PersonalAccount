import React, {FC} from 'react';
import s from './Loading.module.css';
import {Spin} from "antd";

type Props = {
    isAbsoluteCenter?: boolean,
}


export const Loading: FC<Props> = ({isAbsoluteCenter = true}) => {
    return (
        <div className={isAbsoluteCenter ? s.absoluteCenter : ''}>
            <Spin size={'large'} className={s.svg}/>
        </div>
    );
}
