using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.Database.Respositories;
using PersonalAccount.Server.GraphQL.Abstraction;
using PersonalAccount.Server.GraphQL.Modules.Auth.DTO;

namespace PersonalAccount.Server.GraphQL.Modules.Auth
{
    public class AuthMutations : ObjectGraphType, IMutationMarker
    {
        public AuthMutations(UsersRepository usersRepository, AuthService authService)
        {
            Field<AuthResponseType>()
                .Name("Login")
                .Argument<AuthLoginInputType, AuthLoginInput>("authLoginInputType", "Argument for login User")
                .ResolveAsync(async (context) =>
                {
                    AuthLoginInput loginAuthInput = context.GetArgument<AuthLoginInput>("authLoginInputType");
                    return new AuthModel()
                    {
                        Token = await authService.Authenticate(loginAuthInput),
                        User = await usersRepository.GetByEmailAsync(loginAuthInput.Email),
                    };
                });
        }
    }
}
