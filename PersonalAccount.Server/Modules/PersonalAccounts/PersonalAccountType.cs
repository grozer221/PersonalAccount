using GraphQL.Types;

namespace PersonalAccount.Server.Modules.PersonalAccounts;

public class PersonalAccountType : ObjectGraphType<PersonalAccount>
{
    public PersonalAccountType()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
           .Name("Username")
           .Resolve(context => context.Source.Username);
    }
}
