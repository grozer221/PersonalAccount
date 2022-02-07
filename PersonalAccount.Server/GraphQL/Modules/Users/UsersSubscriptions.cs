using GraphQL.Types;
using PersonalAccount.Server.Database.Models;
using PersonalAccount.Server.Database.Respositories;
using PersonalAccount.Server.GraphQL.Abstraction;

namespace PersonalAccount.Server.GraphQL.Modules.Users
{
    public class UsersSubscriptions : ObjectGraphType, ISubscriptionMarker
    {
        public UsersSubscriptions(UsersRepository usersRepository, UsersService usersService)
        {
            Field<UserType>()
                .Name("userAdded")
                .Resolve(context => context.Source as User)
                .Subscribe(context => usersService.UserAddedSubscribe());
        }
    }
}
