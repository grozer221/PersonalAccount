using GraphQL;
using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Users;

public class UsersQueries : ObjectGraphType, IQueryMarker
{
    public UsersQueries(UserRepository usersRepository)
    {
        Field<NonNullGraphType<GetEntitiesResponseType<UserType, UserModel>>, GetEntitiesResponse<UserModel>>()
            .Name("GetUsers")
            .Argument<NonNullGraphType<IntGraphType>, int>("Page", "Argument for Get Users")
            .Resolve(context =>
            {
                int page = context.GetArgument<int>("Page");
                return usersRepository.Get(u => u.CreatedAt, Order.Ascend, page);
            })
            .AuthorizeWith(AuthPolicies.Admin);
        
        Field<NonNullGraphType<UserType>, UserModel>()
            .Name("GetUser")
            .Argument<NonNullGraphType<IdGraphType>, Guid>("Id", "Argument for Get User")
            .ResolveAsync(async context =>
            {
                Guid id = context.GetArgument<Guid>("Id");
                return await usersRepository.GetByIdOrDefaultAsync(id);
            })
            .AuthorizeWith(AuthPolicies.Admin);
    }
}
