using System.Security.Claims;

namespace PersonalAccount.Server.Modules.Auth;

public class AuthClaimsIdentity : ClaimsIdentity
{
    public static string DefaultIdClaimType = "Id";
    public static string DefaultEmailClaimType = "Email";
}
