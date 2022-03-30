using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.GraphQL.Modules.PersonalAccounts.DTO;
using PersonalAccount.Server.Requests;

namespace PersonalAccount.Server.GraphQL.Modules.PersonalAccounts
{
    public class PersonalAccountsMutations : ObjectGraphType, IMutationMarker
    {
        public PersonalAccountsMutations(PersonalAccountRespository personalAccountRespository, IHttpContextAccessor httpContextAccessor, UsersRepository usersRepository, NotificationsService notificationsService)
        {
            Field<NonNullGraphType<UserType>, UserModel>()
                .Name("LoginPersonalAccount")
                .Argument<NonNullGraphType<PersonalAccountLoginInputType>, PersonalAccountLoginInput>("PersonalAccountLoginInputType", "Argument for login in Personal Account")
                .ResolveAsync(async context =>
                {
                    PersonalAccountLoginInput personalAccountLoginInput = context.GetArgument<PersonalAccountLoginInput>("PersonalAccountLoginInputType");
                    List<string>? cookie = await PersonalAccountRequests.Login(personalAccountLoginInput.Username, personalAccountLoginInput.Password);
                    if (cookie == null)
                        throw new Exception("Bad credentials");

                    Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                    List<PersonalAccountModel> personalAccounts = personalAccountRespository.Where(a => a.UserId == userId);
                    string myGroup = await PersonalAccountRequests.GetMyGroup(cookie);
                    UserModel currentUser = await usersRepository.UpdateGroupAsync(userId, myGroup);
                    if (personalAccounts.Count == 0)
                    {
                        PersonalAccountModel newPersonalAccount = new PersonalAccountModel
                        {
                            Username = personalAccountLoginInput.Username,
                            Password = personalAccountLoginInput.Password,
                            CookieList = cookie,
                            UserId = userId,
                        };
                        await personalAccountRespository.CreateAsync(newPersonalAccount);
                        await notificationsService.RebuildScheduleForUser(userId);
                        return currentUser;
                    }
                    else
                    {
                        personalAccounts[0].Username = personalAccountLoginInput.Username;
                        personalAccounts[0].Password = personalAccountLoginInput.Password;
                        personalAccounts[0].CookieList = cookie;
                        await personalAccountRespository.UpdateAsync(personalAccounts[0]);
                        await notificationsService.RebuildScheduleForUser(userId);
                        return currentUser;
                    }
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
            
            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("LogoutPersonalAccount")
                .ResolveAsync(async context =>
                {
                    Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                    List<PersonalAccountModel> personalAccounts = personalAccountRespository.Get(a => a.UserId == userId);
                    if(personalAccounts.Count == 0)
                        throw new Exception("You already logout");
                    await personalAccountRespository.RemoveAsync(personalAccounts[0]);
                    await notificationsService.RebuildScheduleForUser(userId);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
