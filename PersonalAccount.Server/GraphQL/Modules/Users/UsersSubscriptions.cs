using GraphQL.Types;

namespace PersonalAccount.Server.GraphQL.Modules.Users
{
    public class UsersSubscriptions : ObjectGraphType, ISubscriptionMarker
    {
        public UsersSubscriptions(UserRepository usersRepository, UsersService usersService)
        {
            Field<UserType>()
                .Name("userAdded")
                .Resolve(context => context.Source as UserModel)
                .Subscribe(context => usersService.UserAddedSubscribe());
        }
    }
}
