using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.GraphQL.Modules.TelegramAccounts.DTO;

namespace PersonalAccount.Server.GraphQL.Modules.TelegramAccounts
{
    public class TelegramAccountsMutations : ObjectGraphType, IMutationMarker
    {
        public TelegramAccountsMutations(TelegramAccountRepository telegramAccountRepository, IHttpContextAccessor httpContextAccessor, UserRepository usersRepository, NotificationsService notificationsService)
        {
            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("LoginTelegramAccount")
                .Argument<NonNullGraphType<TelegramAccountLoginInputType>, TelegramAccountModel>("TelegramAccountLoginInputType", "Argument for login in Telegram Account")
                .ResolveAsync(async context =>
                {
                    TelegramAccountModel telegramAccount= context.GetArgument<TelegramAccountModel>("TelegramAccountLoginInputType");
                    Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                    telegramAccount.UserId = userId;
                    await telegramAccountRepository.UpdateAsync(telegramAccount);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            //Field<NonNullGraphType<BooleanGraphType>, bool>()
            //    .Name("LogoutPersonalAccount")
            //    .ResolveAsync(async context =>
            //    {
            //        Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
            //        List<PersonalAccountModel> personalAccounts = personalAccountRespository.Get(a => a.UserId == userId);
            //        if (personalAccounts.Count == 0)
            //            throw new Exception("You already logout");
            //        await personalAccountRespository.RemoveAsync(personalAccounts[0]);
            //        await notificationsService.RebuildScheduleForUser(userId);
            //        return true;
            //    })
            //    .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
