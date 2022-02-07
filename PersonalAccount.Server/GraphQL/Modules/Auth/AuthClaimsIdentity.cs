using System.Security.Claims;

namespace PersonalAccount.Server.GraphQL.Modules.Auth
{
    public class AuthClaimsIdentity : ClaimsIdentity
    {
        public static string DefaultIdClaimType = "Id";
    }
}
