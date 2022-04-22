import React, {useEffect, useState} from 'react';
import {useAppSelector} from '../../store/store';
import Title from 'antd/es/typography/Title';
import s from './ScheduleForTwoWeeksPage.module.css';
import {useLazyQuery, useQuery} from '@apollo/client';
import {
    GET_SCHEDULE_FOR_DAY_QUERY,
    GET_SCHEDULE_FOR_TWO_WEEKS_QUERY,
    GetScheduleForDayData,
    GetScheduleForDayVars,
    GetScheduleForTwoWeeksData,
    GetScheduleForTwoWeeksVars,
} from '../../modules/schedule/schedule.queries';
import {Loading} from '../../components/Loading/Loading';
import {Row} from 'antd';
import {messageUtils} from '../../utills/messageUtils';
import Modal from 'antd/lib/modal/Modal';
import {Subject, Week} from '../../modules/schedule/schedule.types';
import parse from 'html-react-parser';

const subjectTimes = ['08:30-09:50', '10:00-11:20', '11:40-13:00', '13:30-14:50', '15:00-16:20', '16:30-17:50', '18:00-19:20'];

export const ScheduleForTwoWeeksPage = () => {
    const me = useAppSelector(s => s.auth.me);
    const [getScheduleForDay, getScheduleForDayOptions] = useLazyQuery<GetScheduleForDayData, GetScheduleForDayVars>(GET_SCHEDULE_FOR_DAY_QUERY);
    const getScheduleForTwoWeeks = useQuery<GetScheduleForTwoWeeksData, GetScheduleForTwoWeeksVars>(GET_SCHEDULE_FOR_TWO_WEEKS_QUERY);
    const [scheduleForTwoWeeks, setScheduleForTwoWeeks] = useState<Week[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    useEffect(() => {
        if (getScheduleForTwoWeeks.data?.getScheduleForTwoWeeks)
            setScheduleForTwoWeeks(getScheduleForTwoWeeks.data.getScheduleForTwoWeeks);
    }, [getScheduleForTwoWeeks.data?.getScheduleForTwoWeeks]);

    const selectSubjectHandler = (subject: Subject, week: number, day: number) => {
        setSelectedSubject(subject);
        if (!subject.link) {
            getScheduleForDay({variables: {week, day}})
                .then(response => {
                    const newLink = response.data?.getScheduleForDay
                        .find(s => s.time === subject.time && s.cabinet === subject.cabinet && subject.teacher.includes(s.teacher))?.link;
                    setSelectedSubject({...subject, link: newLink});

                    const newScheduleForTwoWeeks: Week[] = JSON.parse(JSON.stringify(scheduleForTwoWeeks));
                    newScheduleForTwoWeeks.forEach(w => w.days.forEach(d => d.subjects.forEach(s => {
                        response.data?.getScheduleForDay.forEach(newSubject => {
                            if (s.time === newSubject.time && s.cabinet === newSubject.cabinet && s.teacher.includes(subject.teacher)) {
                                s.link = newSubject.link;
                            }
                        });
                    })));
                    setScheduleForTwoWeeks(newScheduleForTwoWeeks);
                })
                .catch(error => {
                    messageUtils.error(error.message);
                });
        }
    };

    if (getScheduleForTwoWeeks.error)
        messageUtils.error(getScheduleForTwoWeeks.error.message);

    if (getScheduleForTwoWeeks.loading)
        return <Loading/>;

    return (
        <div className={s.wrapperScheduleForTwoWeeksPage}>
            {me?.user.settings.group &&
            <Row justify={'center'}>
                <Title level={3}>
                    <a target={'_blank'}
                       href={`https://rozklad.ztu.edu.ua/schedule/group/${me?.user.settings.group}`}
                    >
                        {me?.user.settings.group} ({me?.user.settings.subGroup})
                    </a>
                </Title>
            </Row>
            }
            <table className={s.scheduleTable}>
                {scheduleForTwoWeeks.map((week, weekId) => (
                    <tbody key={weekId}>
                    <tr>
                        <td colSpan={week.days.length + 1} className={s.weekName}>
                            <Title level={4}>{week.name}</Title>
                        </td>
                    </tr>
                    <tr>
                        <th/>
                        {week.days.map((day, dayId) => (
                            <th key={dayId} className={s.dayName}>
                                <div className={s.extraText}>{day.extraText}</div>
                                <div>{day.name}</div>
                            </th>
                        ))}
                    </tr>
                    {subjectTimes?.map((subjectTime, subjectTimeId) => (
                        <tr key={subjectTimeId}>
                            <td>{subjectTime}</td>
                            {Array.from(Array(week.days.length), (e, i) => {
                                const subject = week.days[i].subjects.find(s => s.time === subjectTime);
                                if (!subject)
                                    return (
                                        <td key={i}
                                            className={week.days[i].extraText ? s.selectedNoContent : ''}
                                        />
                                    );
                                return (
                                    <td key={i}
                                        className={[
                                            week.days[i].extraText ? s.selected : '',
                                            me?.user.settings.personalAccount ? s.clickable : '',
                                        ].join(' ')}
                                        onClick={() => me?.user.settings.personalAccount && selectSubjectHandler(subject, week.number, week.days[i].number)}
                                    >
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
            <Modal
                title={selectedSubject?.name}
                visible={!!selectedSubject}
                footer={null}
                onCancel={() => setSelectedSubject(null)}
            >
                <div className={s.subject}>
                    <div>
                        <span>{selectedSubject?.time} {selectedSubject?.type} </span>
                        <span className={'subjectCabinet'}>{selectedSubject?.cabinet}</span>
                    </div>
                    <div className={'subjectName'}>{selectedSubject?.name}</div>
                    <div className={'subjectTeacher'}>{selectedSubject?.teacher}</div>
                    {getScheduleForDayOptions.loading &&
                    <Row justify={'center'}>
                        <Loading isAbsoluteCenter={false}/>
                    </Row>
                    }
                    {selectedSubject?.link && <div>{parse(selectedSubject?.link)}</div>}
                </div>
            </Modal>
        </div>
    );
};
