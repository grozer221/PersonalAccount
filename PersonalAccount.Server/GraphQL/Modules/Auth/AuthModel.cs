using PersonalAccount.Server.Database.Models;

namespace PersonalAccount.Server.GraphQL.Modules.Auth
{
    public class AuthModel
    {
        public User User { get; set; }
        public string Token { get; set; }
    }
}
