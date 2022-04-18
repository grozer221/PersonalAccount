import React from 'react';
import {useQuery} from '@apollo/client';
import {
    GET_SCHEDULE_FOR_TODAY_QUERY,
    GetScheduleForTodayData,
    GetScheduleForTodayVars,
} from '../../modules/schedule/schedule.queries';
import {Loading} from '../../components/Loading/Loading';
import {messageUtils} from '../../utills/messageUtils';
import parse from 'html-react-parser';
import s from './ScheduleForTodayPage.module.css';

export const ScheduleForTodayPage = () => {
    const getScheduleForToday = useQuery<GetScheduleForTodayData, GetScheduleForTodayVars>(GET_SCHEDULE_FOR_TODAY_QUERY);

    if (getScheduleForToday.error)
        messageUtils.error(getScheduleForToday.error.message);

    if (getScheduleForToday.loading)
        return <Loading/>;

    return (
        <div className={s.subjects}>
            {getScheduleForToday.data?.getScheduleForToday.map(subject => (
                <div className={s.subject}>
                    <div>
                        <span>{subject.time} {subject.type} </span>
                        <span className={'subjectCabinet'}>{subject.cabinet}</span>
                    </div>
                    <div className={'subjectName'}>{subject.name}</div>
                    <div className={'subjectTeacher'}>{subject.teacher}</div>
                    {subject.link && <div>{parse(subject.link)}</div>}
                </div>
            ))}
        </div>
    );
};
