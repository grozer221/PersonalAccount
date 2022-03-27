using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.Requests;

namespace PersonalAccount.Server.GraphQL.Modules.Users
{
    public class UsersMutations : ObjectGraphType, IMutationMarker
    {
        public UsersMutations(UsersRepository usersRepository, IHttpContextAccessor httpContextAccessor, NotificationsService notificationsService)
        {
            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("UpdateGroup")
                .Argument<NonNullGraphType<StringGraphType>, string>("Group", "Argument for Update Group")
                .Argument<IntGraphType, int?>("SubGroup", "Argument for Update SubGroup")
                .ResolveAsync(async context =>
                {
                    string group = context.GetArgument<string>("Group");
                    List<string> allGroups = await RozkladRequests.GetAllGroups();
                    if(!allGroups.Any(g => g.Equals(group, StringComparison.OrdinalIgnoreCase)))
                        throw new Exception("Bad group");
                    int? subGroup = context.GetArgument<int?>("SubGroup");
                    if (subGroup < 1 || subGroup > 2)
                        throw new Exception("Sub group must be in range 1-2");
                    Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                    await usersRepository.UpdateGroupAsync(userId, group, subGroup);
                    await notificationsService.RebuildScheduleForUser(userId);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
            
            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("UpdateEnglishSubGroup")
                .Argument<NonNullGraphType<IntGraphType>, int>("EnglishSubGroup", "Argument for Update EnlishSubGroup")
                .ResolveAsync(async context =>
                {
                    int subGroup = context.GetArgument<int>("EnglishSubGroup");
                    if (subGroup < 1 || subGroup > 2)
                        throw new Exception("Enlish subgroup must be in range 1-2");
                    Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                    await usersRepository.UpdateEnglishSubGroupAsync(userId, subGroup);
                    await notificationsService.RebuildScheduleForUser(userId);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
