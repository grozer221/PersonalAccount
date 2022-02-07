using GraphQL.Types;
using PersonalAccount.Server.Database.Respositories;
using PersonalAccount.Server.GraphQL.Abstraction;

namespace PersonalAccount.Server.GraphQL.Modules.Users
{
    public class UsersQueries : ObjectGraphType, IQueryMarker
    {
        public UsersQueries(UsersRepository usersRepository)
        {
            Field<ListGraphType<UserType>>()
                .Name("getUsers")
                .ResolveAsync(async context => await usersRepository.GetAsync());
        }
    }
}
