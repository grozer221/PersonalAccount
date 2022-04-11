using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.Modules.PersonalAccounts.DTO;

namespace PersonalAccount.Server.Modules.PersonalAccounts;

public class PersonalAccountsMutations : ObjectGraphType, IMutationMarker
{
    public PersonalAccountsMutations(IHttpContextAccessor httpContextAccessor, UserRepository usersRepository, NotificationsService notificationsService, PersonalAccountService personalAccountService)
    {
        Field<NonNullGraphType<UserType>, UserModel>()
            .Name("LoginPersonalAccount")
            .Argument<NonNullGraphType<PersonalAccountLoginInputType>, PersonalAccountLoginInput>("PersonalAccountLoginInputType", "Argument for login in Personal Account")
            .ResolveAsync(async context =>
            {
                Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                UserModel user = await usersRepository.GetByIdAsync(userId);
                if (user.Settings.PersonalAccount != null)
                    throw new Exception("You already logged in");

                PersonalAccountLoginInput personalAccountLoginInput = context.GetArgument<PersonalAccountLoginInput>("PersonalAccountLoginInputType");
                List<string>? cookie = await personalAccountService.Login(personalAccountLoginInput.Username, personalAccountLoginInput.Password);
                if (cookie == null)
                    throw new Exception("Bad credentials");

                string myGroup = await personalAccountService.GetMyGroup(cookie);
                user.Settings.Group = myGroup;
                PersonalAccount newPersonalAccount = new PersonalAccount
                {
                    Username = personalAccountLoginInput.Username,
                    Password = personalAccountLoginInput.Password,
                    CookieList = cookie,
                };
                user.Settings.PersonalAccount = newPersonalAccount;
                await usersRepository.UpdateAsync(user);
                await notificationsService.RebuildScheduleForUserAsync(userId);
                return user;
            })
            .AuthorizeWith(AuthPolicies.Authenticated);
        
        Field<NonNullGraphType<BooleanGraphType>, bool>()
            .Name("LogoutPersonalAccount")
            .ResolveAsync(async context =>
            {
                Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                UserModel user = await usersRepository.GetByIdAsync(userId);
                if(user.Settings.PersonalAccount == null)
                    throw new Exception("You already logout");

                user.Settings.PersonalAccount = null;
                await usersRepository.UpdateAsync(user);
                await notificationsService.RebuildScheduleForUserAsync(userId);
                return true;
            })
            .AuthorizeWith(AuthPolicies.Authenticated);
    }
}
