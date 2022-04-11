using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Users;

public class UserType : BaseType<UserModel>
{
    public UserType() : base()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
           .Name("Email")
           .Resolve(context => context.Source.Email);

        Field<NonNullGraphType<RoleEnumType>, RoleEnum>()
           .Name("Role")
           .Resolve(context => context.Source.Role);
        
        Field<NonNullGraphType<UserSettingsType>, UserSettings>()
           .Name("Settings")
           .Resolve(context => context.Source.Settings);
    }
}

public class RoleEnumType : EnumerationGraphType<RoleEnum>
{
}
