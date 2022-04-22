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
                    List<SelectiveSubject> selectiveSubjects = await personalAccountService.GetSelectiveSubjects(user.Settings.PersonalAccount.CookieList);
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
                                Subject subject = scheduleWithLinksForToday.Item1.FirstOrDefault(sFT => sFT.Time == s.Time && sFT.Cabinet == s.Cabinet && sFT.Teacher == s.Teacher);
                                if (subject != null)
                                {
                                    s.Link = subject.Link;
                                    week.Number = scheduleWithLinksForToday.Item2;
                                };
                            }
                        }
                    }
                    do
                    {
                        Week? week = schedule.FirstOrDefault(w => w.Number != 0);
                        if (week != null)
                        {
                            int weekIndex = schedule.IndexOf(week);
                            if (schedule.Count > weekIndex && schedule.Count > 1)
                                schedule[weekIndex - 1].Number = week.Number - 1;

                            if (0 > weekIndex && schedule.Count > 1)
                                schedule[weekIndex + 1].Number = week.Number + 1;
                        }
                    } while (schedule.Any(w => w.Number == 0));
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

               List<SelectiveSubject> selectiveSubjects = await personalAccountService.GetSelectiveSubjects(user.Settings.PersonalAccount.CookieList);
               var scheduleWithLinks = await personalAccountService.GetScheduleWithLinksForDay(user.Settings.PersonalAccount.CookieList, week, day);
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
