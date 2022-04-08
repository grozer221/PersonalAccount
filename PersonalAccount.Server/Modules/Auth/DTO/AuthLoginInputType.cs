using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Auth.DTO;

public class AuthLoginInputType : InputObjectGraphType<AuthLoginInput>
{
    public AuthLoginInputType()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Email")
            .Resolve(context => context.Source.Email);
        
        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Password")
            .Resolve(context => context.Source.Password);
    }
}
