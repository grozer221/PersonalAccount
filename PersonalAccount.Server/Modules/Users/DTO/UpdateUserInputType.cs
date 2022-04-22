using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Users.DTO;

public class UpdateUserInputType : InputObjectGraphType<UserModel>
{
    public UpdateUserInputType()
    {
        Field<NonNullGraphType<IdGraphType>, Guid>()
           .Name("Id")
           .Resolve(context => context.Source.Id);
        
        Field<NonNullGraphType<StringGraphType>, string>()
           .Name("Email")
           .Resolve(context => context.Source.Email);

        Field<NonNullGraphType<RoleEnumType>, RoleEnum>()
           .Name("Role")
           .Resolve(context => context.Source.Role);
    }
}
