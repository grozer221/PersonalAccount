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
               .Resolve(context => context.Source.Id);

            Field<StringGraphType>()
               .Name("Email")
               .Resolve(context => context.Source.Email);

            Field<RoleEnumType>()
               .Name("Role")
               .Resolve(context => context.Source.Role);
            
            Field<StringGraphType>()
               .Name("Group")
               .Resolve(context => context.Source.Group);
            
            Field<IntGraphType>()
               .Name("SubGroup")
               .Resolve(context => context.Source.SubGroup);

            Field<DateTimeGraphType>()
               .Name("CreatedAt")
               .Resolve(context => context.Source.CreatedAt);

            Field<DateTimeGraphType>()
               .Name("UpdatedAt")
               .Resolve(context => context.Source.UpdatedAt);
        }
    }

    public class RoleEnumType : EnumerationGraphType<RoleEnum>
    {
    }
}
