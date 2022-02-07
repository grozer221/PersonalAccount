using GraphQL.Types;
using PersonalAccount.Server.GraphQL.Modules.Users;

namespace PersonalAccount.Server.GraphQL.Modules.Auth.DTO
{
    public class AuthResponseType : ObjectGraphType<AuthModel>
    {
        public AuthResponseType()
        {
            Field<UserType>()
                .Name("User")
                .Description("User type")
                .Resolve(context => context.Source.User);

            Field<StringGraphType>()
                .Name("Token")
                .Description("Token type")
                .Resolve(context => context.Source.Token);
        }
    }
}
