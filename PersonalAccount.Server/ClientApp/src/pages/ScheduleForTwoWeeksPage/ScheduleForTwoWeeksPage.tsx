import React from 'react';
import {useAppSelector} from '../../store/store';
import Title from 'antd/es/typography/Title';
import s from './ScheduleForTwoWeeksPage.module.css';
import {useQuery} from '@apollo/client';
import {
    GET_SCHEDULE_FOR_TWO_WEEKS_QUERY,
    GetScheduleForTwoWeeksData,
    GetScheduleForTwoWeeksVars,
} from '../../modules/schedule/schedule.queries';
import {Loading} from '../../components/Loading/Loading';

const subjectTimes = ['8:30-9:50', '10:00-11:20', '11:40-13:00', '13:30-14:50', '15:00-16:20', '16:30-17:50', '18:00-19:20'];

export const ScheduleForTwoWeeksPage = () => {
    const me = useAppSelector(s => s.auth.me);
    const getScheduleForTwoWeeks = useQuery<GetScheduleForTwoWeeksData, GetScheduleForTwoWeeksVars>(GET_SCHEDULE_FOR_TWO_WEEKS_QUERY);

    if (getScheduleForTwoWeeks.loading)
        return <Loading/>;

    return (
        <div className={s.wrapperScheduleForTwoWeeksPage}>
            <Title level={3}>{me?.user.group} ({me?.user.subGroup})</Title>
            {getScheduleForTwoWeeks.data?.getScheduleForTwoWeeks.map((week, weekId) => (
                <div key={weekId}>
                    <Title level={4}>{week.name}</Title>
                    <table className={s.scheduleTable}>
                        <tr>
                            <th></th>
                            {week.days.map((day, dayId) => (
                                <th>{day.name}</th>
                            ))}
                        </tr>
                        {subjectTimes.map((subjectTime, subjectTimeId) => (
                            <tr key={subjectTimeId}>
                                <td>{subjectTime}</td>
                                {Array.from(Array(week.days.length), (e, i) => {
                                    const subject = week.days[i].subjects.find(s => s.time === subjectTime);
                                    if (!subject)
                                        return <td key={i}/>;
                                    return (
                                        <td key={i}>
                                            <div className={s.subjectName}>{subject?.name}</div>
                                            <div>{subject?.type}</div>
                                            <div className={s.subjectCabinet}>{subject?.cabinet}</div>
                                            <div className={s.subjectTeacher}>{subject?.teacher}</div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </table>
                </div>
            ))}
        </div>
    );
};
