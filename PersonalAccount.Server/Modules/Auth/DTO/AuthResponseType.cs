using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Auth.DTO;

public class AuthResponseType : ObjectGraphType<AuthResponse>
{
    public AuthResponseType()
    {
        Field<NonNullGraphType<UserType>, UserModel>()
            .Name("User")
            .Resolve(context => context.Source.User);

        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Token")
            .Resolve(context => context.Source.Token);
    }
}
