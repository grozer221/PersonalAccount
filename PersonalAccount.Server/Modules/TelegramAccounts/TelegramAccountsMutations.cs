using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.Modules.TelegramAccounts.DTO;

namespace PersonalAccount.Server.Modules.TelegramAccounts;

public class TelegramAccountsMutations : ObjectGraphType, IMutationMarker
{
    public TelegramAccountsMutations(IHttpContextAccessor httpContextAccessor, NotificationsService notificationsService, UserRepository userRepository)
    {
        Field<NonNullGraphType<TelegramAccountType>, TelegramAccount>()
            .Name("LoginTelegramAccount")
            .Argument<NonNullGraphType<TelegramAccountLoginInputType>, TelegramAccount>("TelegramAccountLoginInputType", "Argument for login in Telegram Account")
            .ResolveAsync(async context =>
            {
                TelegramAccount telegramAccount= context.GetArgument<TelegramAccount>("TelegramAccountLoginInputType");
                Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                UserModel user = await userRepository.GetByIdAsync(userId);
                if (user.Settings.TelegramAccount != null)
                    throw new Exception("You already login");

                user.Settings.TelegramAccount = telegramAccount;
                await userRepository.UpdateAsync(user);
                return telegramAccount;
            })
            .AuthorizeWith(AuthPolicies.Authenticated);

        Field<NonNullGraphType<BooleanGraphType>, bool>()
            .Name("LogoutTelegramAccount")
            .ResolveAsync(async context =>
            {
                Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                UserModel user = await userRepository.GetByIdAsync(userId);
                if (user.Settings.TelegramAccount == null)
                    throw new Exception("You already logout");

                user.Settings.TelegramAccount = null;
                await userRepository.UpdateAsync(user);
                await notificationsService.RebuildScheduleForUserAsync(userId);
                return true;
            })
            .AuthorizeWith(AuthPolicies.Authenticated);
    }
}
