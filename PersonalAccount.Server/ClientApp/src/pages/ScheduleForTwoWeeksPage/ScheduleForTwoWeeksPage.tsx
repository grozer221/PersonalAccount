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
import {Row} from 'antd';
import {messageUtils} from '../../utills/messageUtils';

const subjectTimes = ['08:30-09:50', '10:00-11:20', '11:40-13:00', '13:30-14:50', '15:00-16:20', '16:30-17:50', '18:00-19:20'];

export const ScheduleForTwoWeeksPage = () => {
    const me = useAppSelector(s => s.auth.me);
    const getScheduleForTwoWeeks = useQuery<GetScheduleForTwoWeeksData, GetScheduleForTwoWeeksVars>(GET_SCHEDULE_FOR_TWO_WEEKS_QUERY);

    if (getScheduleForTwoWeeks.error)
        messageUtils.error(getScheduleForTwoWeeks.error.message);

    if (getScheduleForTwoWeeks.loading)
        return <Loading/>;

    return (
        <div className={s.wrapperScheduleForTwoWeeksPage}>
            <Row justify={'center'}>
                <Title level={3}>{me?.user.settings.group} ({me?.user.settings.subGroup})</Title>
            </Row>
            <table className={s.scheduleTable}>
                {getScheduleForTwoWeeks.data?.getScheduleForTwoWeeks.map((week, weekId) => (
                    <tbody key={weekId}>
                        <tr>
                            <td colSpan={week.days.length + 1} style={{border: 'none'}}>
                                <Title level={4}>{week.name}</Title>
                            </td>
                        </tr>
                        <tr>
                            <th/>
                            {week.days.map((day, dayId) => (
                                <th key={dayId}>{day.name}</th>
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
                                            <div className={'subjectName'}>{subject?.name}</div>
                                            <div>{subject?.type}</div>
                                            <div className={'subjectCabinet'}>{subject?.cabinet}</div>
                                            <div className={'subjectTeacher'}>{subject?.teacher}</div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                ))}
            </table>
        </div>
    );
};
