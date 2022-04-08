using GraphQL.Types;

namespace PersonalAccount.Server.Modules.PersonalAccounts;

public class PersonalAccountType : BaseType<PersonalAccountModel>
{
    public PersonalAccountType() : base()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
           .Name("Username")
           .Resolve(context => context.Source.Username);
    }
}
