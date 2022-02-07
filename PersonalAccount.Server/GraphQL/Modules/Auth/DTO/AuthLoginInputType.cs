using GraphQL.Types;

namespace PersonalAccount.Server.GraphQL.Modules.Auth.DTO
{
    public class AuthLoginInputType : InputObjectGraphType<AuthLoginInput>
    {
        public AuthLoginInputType()
        {
            Field<StringGraphType>()
                .Name("Email")
                .Resolve(context => context.Source.Email);
            
            Field<StringGraphType>()
                .Name("Password")
                .Resolve(context => context.Source.Password);
        }
    }
}
