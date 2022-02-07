using GraphQL.Types;
using PersonalAccount.Server.Database.Models;

namespace PersonalAccount.Server.GraphQL.Modules.Users.DTO
{
    public class UsersCreateInputType : InputObjectGraphType<User>
    {
        public UsersCreateInputType()
        {
            Field(u => u.Email, type: typeof(StringGraphType));

        }
    }
}
