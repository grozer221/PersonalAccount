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

                List<SelectiveSubject> selectiveSubjects = user.Settings.PersonalAccount == null 
                    ? new List<SelectiveSubject>() 
                    : await personalAccountService.GetSelectiveSubjects(user.Settings.PersonalAccount.CookieList);
                return await scheduleService.GetScheduleForTwoWeekAsync(user.Settings.Group, user.Settings.SubGroup, user.Settings.EnglishSubGroup, selectiveSubjects);
            })
            .AuthorizeWith(AuthPolicies.Authenticated);

        Field<NonNullGraphType<ListGraphType<SubjectType>>, List<Subject>>()
           .Name("GetScheduleForToday")
           .ResolveAsync(async context =>
           {
               Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
               UserModel user = await usersRepository.GetByIdAsync(userId);
               if (user.Settings.Group == null)
                   throw new Exception("Choose your group");

               if (user.Settings.PersonalAccount?.CookieList == null)
                   return await scheduleService.GetScheduleForToday(user.Settings.Group, user.Settings.SubGroup, user.Settings.EnglishSubGroup, new List<SelectiveSubject>());
               else
               {
                   List<SelectiveSubject> selectiveSubjects = await personalAccountService.GetSelectiveSubjects(user.Settings.PersonalAccount.CookieList);
                   //return await PersonalAccountRequests.GetMyScheduleWithLinksForToday(user.Settings.PersonalAccount.CookieList, user.Settings.Group, user.Settings.SubGroup, user.Settings.EnglishSubGroup, selectiveSubjects);
                   return await personalAccountService.GetScheduleWithLinksForToday(user.Settings.PersonalAccount.CookieList);
               }
           })
           .AuthorizeWith(AuthPolicies.Authenticated);
        
        Field<NonNullGraphType<ListGraphType<StringGraphType>>, List<string>>()
           .Name("GetAllGroups")
           .ResolveAsync(async context => await scheduleService.GetAllGroups())
           .AuthorizeWith(AuthPolicies.Authenticated);
        
        Field<NonNullGraphType<ListGraphType<SelectiveSubjectType>>, List<SelectiveSubject>>()
           .Name("GetSelectiveSubjects")
           .ResolveAsync(async context =>
           {
               Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
               UserModel user = await usersRepository.GetByIdAsync(userId);
               if (user.Settings.PersonalAccount?.CookieList == null)
                   return new List<SelectiveSubject>();
               else
                   return await personalAccountService.GetSelectiveSubjects(user.Settings.PersonalAccount.CookieList);
           })
           .AuthorizeWith(AuthPolicies.Authenticated);
    }
}
