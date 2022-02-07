using GraphQL.Types;
using PersonalAccount.Server.Database.Models;

namespace PersonalAccount.Server.GraphQL.Modules.Users
{
    public class UserType : ObjectGraphType<User>
    {
        public UserType()
        {
            Field<IdGraphType>()
               .Name("Id")
               .Description("User id.")
               .Resolve(context => context.Source.Id);

            Field<StringGraphType>()
               .Name("Email")
               .Description("User Email.")
               .Resolve(context => context.Source.Email);

            Field<RoleEnumType>()
               .Name("Role")
               .Description("User role.")
               .Resolve(context => context.Source.Role);

            Field<DateTimeGraphType>()
               .Name("CreatedAt")
               .Description("User creation date.")
               .Resolve(context => context.Source.CreatedAt);

            Field<DateTimeGraphType>()
               .Name("UpdatedAt")
               .Description("User update date.")
               .Resolve(context => context.Source.UpdatedAt);
        }
    }

    public class RoleEnumType : EnumerationGraphType<RoleEnum>
    {
    }
}
