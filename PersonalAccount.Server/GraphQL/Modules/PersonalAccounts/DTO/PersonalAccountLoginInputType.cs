using GraphQL.Types;

namespace PersonalAccount.Server.GraphQL.Modules.PersonalAccounts.DTO
{
    public class PersonalAccountLoginInputType : InputObjectGraphType<PersonalAccountLoginInput>
    {
        public PersonalAccountLoginInputType()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
                .Name("Username")
                .Resolve(context => context.Source.Username);

            Field<NonNullGraphType<StringGraphType>, string>()
                .Name("Password")
                .Resolve(context => context.Source.Password);
        }
    }
}
