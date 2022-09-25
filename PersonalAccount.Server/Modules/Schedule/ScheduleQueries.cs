using GraphQL;
using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Schedule;

public class ScheduleQueries : ObjectGraphType, IQueryMarker
{
    public ScheduleQueries(IHttpContextAccessor httpContextAccessor, UserRepository usersRepository, PersonalAccountService personalAccountService, ScheduleService scheduleService)
    {
        Field<NonNullGraphType<ListGraphType<WeekType>>, List<Week>>()
            .Name("GetScheduleForTwoWeeks")
            .ResolveAsync(async context =>
            {
                Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                UserModel user = await usersRepository.GetByIdAsync(userId);
                if (user.Settings.Group == null)
                    throw new Exception("Choose your group");

                if (user.Settings.PersonalAccount == null)
                {
                    List<SelectiveSubject> selectiveSubjects = new List<SelectiveSubject>();
                    return await scheduleService.GetScheduleForTwoWeekAsync(user.Settings.Group, user.Settings.SubGroup, user.Settings.EnglishSubGroup, selectiveSubjects);
                }
                else
                {
                    List<SelectiveSubject> selectiveSubjects = await personalAccountService.GetSelectiveSubjectsAsync(user.Settings.PersonalAccount.CookieList);
                    var scheduleWithLinksForToday = await personalAccountService.GetScheduleWithLinksForToday(user.Settings.PersonalAccount.CookieList);
                    List<Week> schedule = await scheduleService.GetScheduleForTwoWeekAsync(user.Settings.Group, user.Settings.SubGroup, user.Settings.EnglishSubGroup, selectiveSubjects);
                    foreach (var week in schedule)
                    {
                        int dayNumber = 1;
                        foreach (var day in week.Days)
                        {
                            day.Number = dayNumber++;
                            foreach (var s in day.Subjects)
                            {
                                Subject? subject = scheduleWithLinksForToday.Item1.FirstOrDefault(sWL => sWL.Time == s.Time 
                                    && sWL.Cabinet == s.Cabinet     
                                    && s.Teacher.Contains(sWL.Teacher, StringComparison.OrdinalIgnoreCase));
                                if (subject != null)
                                {
                                    s.Link = subject.Link;
                                    week.Number = scheduleWithLinksForToday.Item2;
                                };
                            }
                        }
                    }
                    if (scheduleWithLinksForToday.Item2 % 2 != 0)
                    {
                        schedule[0].Number = scheduleWithLinksForToday.Item2;
                        schedule[1].Number = scheduleWithLinksForToday.Item2 + 1;
                    }
                    else
                    {
                        schedule[1].Number = scheduleWithLinksForToday.Item2;
                        schedule[0].Number = scheduleWithLinksForToday.Item2 - 1;
                    }

                    (List<Subject>, int, string) dayWithSelectiveSubjectsForThirdCourse = new (null, 0, null);
                    foreach (var week in schedule)
                    {
                        foreach (var day in week.Days)
                        {
                            foreach (var subject in day.Subjects)
                            {
                                if (subject.Name.Contains("Вибіркова дисципліна", StringComparison.OrdinalIgnoreCase))
                                {
                                    if (dayWithSelectiveSubjectsForThirdCourse.Item1 == null)
                                    {
                                        dayWithSelectiveSubjectsForThirdCourse = await personalAccountService.GetScheduleWithLinksForDayAsync(user.Settings.PersonalAccount.CookieList, week.Number, day.Number);
                                    }
                                    var subjectWithCurrentTime = dayWithSelectiveSubjectsForThirdCourse.Item1.Where(s => s.Time == subject.Time);
                                    var currentSubject = subjectWithCurrentTime.FirstOrDefault(s => selectiveSubjects.Any(ss => ss.IsSelected == true && ss.Name.Contains(s.Name)));
                                    if(currentSubject != null)
                                    {
                                        subject.Time = currentSubject.Time;
                                        subject.Cabinet = currentSubject.Cabinet;
                                        subject.Type = currentSubject.Type;
                                        subject.Name = currentSubject.Name;
                                        subject.Teacher = currentSubject.Teacher;
                                        subject.Link = currentSubject.Link;
                                    }
                                }
                            }
                        }
                    }
                    foreach (var week in schedule)
                        foreach (var day in week.Days)
                            day.Subjects = day.Subjects.Where(s => !s.Name.Contains("Вибіркова дисципліна"));
                    return schedule;
                }
            })
            .AuthorizeWith(AuthPolicies.Authenticated);

        //Field<NonNullGraphType<ListGraphType<SubjectType>>, List<Subject>>()
        //   .Name("GetScheduleForToday")
        //   .ResolveAsync(async context =>
        //   {
        //       Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
        //       UserModel user = await usersRepository.GetByIdAsync(userId);
        //       if (user.Settings.Group == null)
        //           throw new Exception("Choose your group");

        //       if (user.Settings.PersonalAccount?.CookieList == null)
        //           return await scheduleService.GetScheduleForTodayAsync(user.Settings.Group, user.Settings.SubGroup, user.Settings.EnglishSubGroup, new List<SelectiveSubject>());
        //       else
        //       {
        //           List<SelectiveSubject> selectiveSubjects = await personalAccountService.GetSelectiveSubjects(user.Settings.PersonalAccount.CookieList);
        //           (List<Subject>, int, string) scheduleWithLinks = await personalAccountService.GetScheduleWithLinksForToday(user.Settings.PersonalAccount.CookieList);
        //           List<Subject> schedule = await scheduleService.GetScheduleForDayAsync(scheduleWithLinks.Item2, scheduleWithLinks.Item3, user.Settings.Group, user.Settings.SubGroup, user.Settings.EnglishSubGroup, selectiveSubjects);
        //           return scheduleWithLinks.Item1
        //               .Where(s => schedule.Any(ss => ss.Time == s.Time && ss.Cabinet == s.Cabinet && ss.Teacher == s.Teacher))
        //               .ToList();
        //       }
        //   })
        //   .AuthorizeWith(AuthPolicies.Authenticated);

        Field<NonNullGraphType<ListGraphType<SubjectType>>, List<Subject>>()
           .Name("GetScheduleForDay")
           .Argument<NonNullGraphType<IntGraphType>, int>("Week", "Argument for Get Schedule")
           .Argument<NonNullGraphType<IntGraphType>, int>("Day", "Argument for Get Schedule")
           .ResolveAsync(async context =>
           {
               Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
               UserModel user = await usersRepository.GetByIdAsync(userId);
               if (user.Settings.PersonalAccount?.CookieList == null)
                   throw new Exception("You cant not Get Schedule For Day");

               if (user.Settings.Group == null)
                   throw new Exception("Choose your group");

               int week = context.GetArgument<int>("Week");
               if (week > 16 || week < 1)
                   throw new Exception("Week must be in range 1-16");
               int day = context.GetArgument<int>("Day");
               if (day > 7 || day < 1)
                   throw new Exception("Week must be in range 1-7");

               List<SelectiveSubject> selectiveSubjects = await personalAccountService.GetSelectiveSubjectsAsync(user.Settings.PersonalAccount.CookieList);
               var scheduleWithLinks = await personalAccountService.GetScheduleWithLinksForDayAsync(user.Settings.PersonalAccount.CookieList, week, day);
               int weekNumber1Or2 = scheduleWithLinks.Item2 % 2 == 0 ? 2 : 1;
               List<Subject> schedule = await scheduleService.GetScheduleForDayAsync(weekNumber1Or2, scheduleWithLinks.Item3, user.Settings.Group, user.Settings.SubGroup, user.Settings.EnglishSubGroup, selectiveSubjects);
               return scheduleWithLinks.Item1
                   .Where(sWL => schedule.Any(ss => ss.Time == sWL.Time && ss.Cabinet == sWL.Cabinet && ss.Teacher.Contains(sWL.Teacher)))
                   .ToList();
           })
           .AuthorizeWith(AuthPolicies.Authenticated);

        Field<NonNullGraphType<ListGraphType<StringGraphType>>, List<string>>()
           .Name("GetAllGroups")
           .ResolveAsync(async context => await scheduleService.GetAllGroupsAsync())
           .AuthorizeWith(AuthPolicies.Authenticated);

        //Field<NonNullGraphType<ListGraphType<SelectiveSubjectType>>, List<SelectiveSubject>>()
        //   .Name("GetSelectiveSubjects")
        //   .ResolveAsync(async context =>
        //   {
        //       Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
        //       UserModel user = await usersRepository.GetByIdAsync(userId);
        //       if (user.Settings.PersonalAccount?.CookieList == null)
        //           return new List<SelectiveSubject>();
        //       else
        //           return await personalAccountService.GetSelectiveSubjects(user.Settings.PersonalAccount.CookieList);
        //   })
        //   .AuthorizeWith(AuthPolicies.Authenticated);
    }
}
