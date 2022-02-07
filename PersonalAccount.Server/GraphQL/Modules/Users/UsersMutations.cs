using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.Database.Models;
using PersonalAccount.Server.Database.Respositories;
using PersonalAccount.Server.GraphQL.Abstraction;
using PersonalAccount.Server.GraphQL.Modules.Auth;
using PersonalAccount.Server.GraphQL.Modules.Users.DTO;

namespace PersonalAccount.Server.GraphQL.Modules.Users
{
    public class UsersMutations : ObjectGraphType, IMutationMarker
    {
        public UsersMutations(UsersRepository usersRepository, UsersService usersService)
        {
            Field<UserType>()
                .Name("createUser")
                .Argument<UsersCreateInputType, User>("usersCreateInputType", "Argument for create new User")
                .ResolveAsync(async (context) =>
                {
                    User user = context.GetArgument<User>("usersCreateInputType");
                    user = await usersRepository.CreateAsync(user);
                    usersService.AddUser(user);
                    return user;
                })
                .AuthorizeWith(AuthPolicies.Admin);
        }
    }
}
