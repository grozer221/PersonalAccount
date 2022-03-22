using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.GraphQL.Modules.PersonalAccounts.DTO;
using PersonalAccount.Server.Requests;

namespace PersonalAccount.Server.GraphQL.Modules.PersonalAccounts
{
    public class PersonalAccountsMutations : ObjectGraphType, IMutationMarker
    {
        public PersonalAccountsMutations(PersonalAccountRespository personalAccountRespository, IHttpContextAccessor httpContextAccessor)
        {
            Field<NonNullGraphType<PersonalAccountType>, PersonalAccountModel>()
                .Name("LoginPersonalAccount")
                .Argument<NonNullGraphType<PersonalAccountLoginInputType>, PersonalAccountLoginInput>("PersonalAccountLoginInputType", "Argument for login in Personal Account")
                .ResolveAsync(async context =>
                {
                    PersonalAccountLoginInput personalAccountLoginInput = context.GetArgument<PersonalAccountLoginInput>("PersonalAccountLoginInputType");
                    List<string>? cookie = await PersonalAccountRequests.Login(personalAccountLoginInput.Username, personalAccountLoginInput.Password);
                    if (cookie == null)
                        throw new Exception("Bad credensials");

                    Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                    List<PersonalAccountModel> personalAccounts = personalAccountRespository.Get(a => a.UserId == userId);
                    if(personalAccounts.Count() == 0)
                    {
                        PersonalAccountModel newPersonalAccount = new PersonalAccountModel
                        {
                            Username = personalAccountLoginInput.Username,
                            Password = personalAccountLoginInput.Password,
                            CookieList = cookie,
                            UserId = userId,
                        };
                        await personalAccountRespository.CreateAsync(newPersonalAccount);
                        return newPersonalAccount;
                    }
                    else
                    {
                        personalAccounts[0].Username = personalAccountLoginInput.Username;
                        personalAccounts[0].Password = personalAccountLoginInput.Password;
                        personalAccounts[0].CookieList = cookie;
                        await personalAccountRespository.UpdateAsync(personalAccounts[0]);
                        return personalAccounts[0];
                    }
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
