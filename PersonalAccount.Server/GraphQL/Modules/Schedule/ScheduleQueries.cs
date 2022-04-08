using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.ViewModels;

namespace PersonalAccount.Server.GraphQL.Modules.Schedule
{
    public class ScheduleQueries : ObjectGraphType, IQueryMarker
    {
        public ScheduleQueries(IHttpContextAccessor httpContextAccessor, UserRepository usersRepository, PersonalAccountService personalAccountService, ScheduleService scheduleService)
        {
            Field<NonNullGraphType<ListGraphType<WeekType>>, List<Week>>()
                .Name("GetScheduleForTwoWeeks")
                .ResolveAsync(async context =>
                {
                    Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                    UserModel user = await usersRepository.GetByIdAsync(userId, u => u.PersonalAccount);
                    List<SelectiveSubject> selectiveSubjects = user.PersonalAccount == null 
                        ? new List<SelectiveSubject>() 
                        : await personalAccountService.GetSelectiveSubjects(user.PersonalAccount.CookieList);
                    return await scheduleService.GetScheduleForTwoWeekAsync(user.Group, user.SubGroup, user.EnglishSubGroup, selectiveSubjects);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<ListGraphType<SubjectType>>, List<Subject>>()
               .Name("GetScheduleForToday")
               .ResolveAsync(async context =>
               {
                   Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                   UserModel user = await usersRepository.GetByIdAsync(userId, u => u.PersonalAccount);
                   if(user.PersonalAccount?.CookieList == null)
                       return await scheduleService.GetScheduleForToday(user.Group, user.SubGroup, user.EnglishSubGroup, new List<SelectiveSubject>());
                   else
                   {
                       List<SelectiveSubject> selectiveSubjects = await personalAccountService.GetSelectiveSubjects(user.PersonalAccount.CookieList);
                       //return await PersonalAccountRequests.GetMyScheduleWithLinksForToday(user.PersonalAccount.CookieList, user.Group, user.SubGroup, user.EnglishSubGroup, selectiveSubjects);
                       return await personalAccountService.GetScheduleWithLinksForToday(user.PersonalAccount.CookieList);
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
                   UserModel user = await usersRepository.GetByIdAsync(userId, u => u.PersonalAccount);
                   if (user.PersonalAccount?.CookieList == null)
                       return new List<SelectiveSubject>();
                   else
                       return await personalAccountService.GetSelectiveSubjects(user.PersonalAccount.CookieList);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
