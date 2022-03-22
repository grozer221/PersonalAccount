using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.Requests;
using PersonalAccount.Server.ViewModels;

namespace PersonalAccount.Server.GraphQL.Modules.Schedule
{
    public class ScheduleQueries : ObjectGraphType, IQueryMarker
    {
        public ScheduleQueries(IHttpContextAccessor httpContextAccessor, UsersRepository usersRepository)
        {
            Field<NonNullGraphType<ListGraphType<WeekType>>, List<Week>>()
                .Name("GetScheduleForTwoWeeks")
                .ResolveAsync(async context =>
                {
                    Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                    UserModel user = await usersRepository.GetByIdAsync(userId);
                    return await RozkladRequests.GetScheduleForTwoWeekAsync(user.Group, user.SubGroup);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<ListGraphType<SubjectType>>, List<Subject>>()
               .Name("GetScheduleForToday")
               .ResolveAsync(async context =>
               {
                   Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                   UserModel user = await usersRepository.GetByIdAsync(userId, u => u.PersonalAccount);
                   if(user.PersonalAccount?.CookieList == null)
                       return await RozkladRequests.GetScheduleForToday(user.Group, user.SubGroup);
                   else
                       return await PersonalAccountRequests.GetMyScheduleWithLinksForToday(user.PersonalAccount.CookieList, user.Group, user.SubGroup);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
