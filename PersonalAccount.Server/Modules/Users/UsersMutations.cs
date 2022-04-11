using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.Modules.Users.DTO;

namespace PersonalAccount.Server.Modules.Users;

public class UsersMutations : ObjectGraphType, IMutationMarker
{
    public UsersMutations(UserRepository usersRepository, IHttpContextAccessor httpContextAccessor, NotificationsService notificationsService, ScheduleService scheduleService)
    {
        Field<NonNullGraphType<UserSettingsType>, UserSettings>()
            .Name("UpdateSettings")
            .Argument<NonNullGraphType<UpdateSettingsInputType>, UserSettings>("UpdateSettingsInputType", "Argument for Update Settings")
            .ResolveAsync(async context =>
            {
                UserSettings userSettings = context.GetArgument<UserSettings>("UpdateSettingsInputType");
                List<string> allGroups = await scheduleService.GetAllGroups();
                if (!allGroups.Any(g => g.Equals(userSettings.Group, StringComparison.OrdinalIgnoreCase)))
                    throw new Exception("Bad group");

                Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                UserModel user = await usersRepository.GetByIdAsync(userId);
                if (user.Settings.PersonalAccount != null)
                    userSettings.Group = user.Settings.Group;
                userSettings.TelegramAccount = user.Settings.TelegramAccount;
                userSettings.PersonalAccount = user.Settings.PersonalAccount;

                user.Settings = userSettings;
                await usersRepository.UpdateAsync(user);
                await notificationsService.RebuildScheduleForUserAsync(userId);
                return userSettings;
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
