using GraphQL;
using GraphQL.Types;
using Microsoft.AspNetCore.Http;
using PersonalAccount.Server.Database.Models;
using PersonalAccount.Server.Database.Respositories;
using PersonalAccount.Server.GraphQL.Abstraction;
using PersonalAccount.Server.GraphQL.Modules.Auth;
using PersonalAccount.Server.Requests;

namespace PersonalAccount.Server.GraphQL.Modules.Schedule
{
    public class ScheduleQueries : ObjectGraphType, IQueryMarker
    {
        public ScheduleQueries(IHttpContextAccessor httpContextAccessor, UsersRepository usersRepository)
        {
            Field<ListGraphType<WeekType>>()
                .Name("getScheduleForTwoWeeks")
                .ResolveAsync(async context =>
                {
                    User user = await usersRepository.GetByEmailAsync(httpContextAccessor.HttpContext.User.Identity.Name);
                    return await RozkladRequests.GetScheduleForTwoWeekAsync(user.Group, user.SubGroup);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<ListGraphType<SubjectType>>()
               .Name("getScheduleWithLinksForToday")
               .ResolveAsync(async context =>
               {
                   User user = await usersRepository.GetByEmailIncludedPersonalAccountAsync(httpContextAccessor.HttpContext.User.Identity.Name);
                   return await PersonalAccountRequests.GetScheduleWithLinksForToday(user.PersonalAccount.CookieList, user.Group, user.SubGroup);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);
            
            Field<ListGraphType<SubjectType>>()
               .Name("getMyScheduleWithLinksForToday")
               .ResolveAsync(async context =>
               {
                   User user = await usersRepository.GetByEmailIncludedPersonalAccountAsync(httpContextAccessor.HttpContext.User.Identity.Name);
                   return await PersonalAccountRequests.GetMyScheduleWithLinksForToday(user.PersonalAccount.CookieList, user.Group, user.SubGroup);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
