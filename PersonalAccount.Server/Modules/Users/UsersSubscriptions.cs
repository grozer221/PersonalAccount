using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Users;

public class UsersSubscriptions : ObjectGraphType, ISubscriptionMarker
{
    public UsersSubscriptions(UserRepository usersRepository, UsersService usersService)
    {
        Field<NonNullGraphType<UserType>, UserModel>()
            .Name("userAdded")
            .Resolve(context => context.Source as UserModel)
            .Subscribe(context => usersService.UserAddedSubscribe());
    }
}
