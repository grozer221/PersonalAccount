using GraphQL;
using GraphQL.Types;

namespace PersonalAccount.Server.GraphQL.Modules.Users
{
    public class UsersMutations : ObjectGraphType, IMutationMarker
    {
        public UsersMutations(UserRepository usersRepository, IHttpContextAccessor httpContextAccessor, NotificationsService notificationsService, ScheduleService scheduleService)
        {
            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("UpdateGroup")
                .Argument<NonNullGraphType<StringGraphType>, string>("Group", "Argument for Update Group")
                .Argument<NonNullGraphType<IntGraphType>, int>("SubGroup", "Argument for Update SubGroup")
                .ResolveAsync(async context =>
                {
                    List<string> allGroups = await scheduleService.GetAllGroups();

                    string group = context.GetArgument<string>("Group");
                    if (!allGroups.Any(g => g.Equals(group, StringComparison.OrdinalIgnoreCase)))
                        throw new Exception("Bad group");

                    int subGroup = context.GetArgument<int>("SubGroup");
                    if (subGroup < 1 || subGroup > 2)
                        throw new Exception("Sub group must be in range 1-2");

                    Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                    await usersRepository.UpdateGroupAsync(userId, group, subGroup);
                    await notificationsService.RebuildScheduleForUserAsync(userId);
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
                    await notificationsService.RebuildScheduleForUserAsync(userId);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
            
            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("UpdateMinutesBeforeLessonNotification")
                .Argument<NonNullGraphType<IntGraphType>, int>("MinutesBeforeLessonNotification", "Argument for Update MinutesBeforeLessonNotification")
                .Argument<NonNullGraphType<IntGraphType>, int>("MinutesBeforeLessonsNotification", "Argument for Update MinutesBeforeLessonNotification")
                .ResolveAsync(async context =>
                {
                    int minutesBeforeLessonNotification = context.GetArgument<int>("MinutesBeforeLessonNotification");
                    if (minutesBeforeLessonNotification < 1 || minutesBeforeLessonNotification > 30)
                        throw new Exception("Minutes before lesson notification must be in range 1-30");

                    int minutesBeforeLessonsNotification = context.GetArgument<int>("MinutesBeforeLessonsNotification");
                    if (minutesBeforeLessonsNotification < 1 || minutesBeforeLessonsNotification > 60)
                        throw new Exception("Minutes before lessons notification must be in range 1-60");

                    Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                    await usersRepository.UpdateMinutesBeforeLessonNotification(userId, minutesBeforeLessonNotification, minutesBeforeLessonsNotification);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
            
            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("RemoveUser")
                .Argument<NonNullGraphType<IdGraphType>, Guid>("UserId", "Argument for Remove User")
                .ResolveAsync(async context =>
                {
                    Guid userId = context.GetArgument<Guid>("UserId");
                    Guid currentUserId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                    if (currentUserId == userId)
                        throw new Exception("You can not remove yourself");

                    await usersRepository.RemoveAsync(userId);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Admin);
        }
    }
}
