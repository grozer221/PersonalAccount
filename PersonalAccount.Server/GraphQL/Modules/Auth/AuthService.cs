using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PersonalAccount.Server.GraphQL.Modules.Auth
{
    public class AuthService
    {
        public string GenerateAccessToken(Guid userId, string userEmail, RoleEnum userRole)
        {
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("AuthIssuerSigningKey")));
            SigningCredentials signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            List<Claim> claims = new List<Claim>
            {
                new Claim(AuthClaimsIdentity.DefaultIdClaimType, userId.ToString()),
                new Claim(AuthClaimsIdentity.DefaultEmailClaimType, userEmail),
                new Claim(AuthClaimsIdentity.DefaultRoleClaimType, userRole.ToString()),
            };
            JwtSecurityToken token = new JwtSecurityToken(
                issuer: Environment.GetEnvironmentVariable("AuthValidIssuer"),
                audience: Environment.GetEnvironmentVariable("AuthValidAudience"),
                claims: claims,
                expires: DateTime.Now.AddDays(30),
                signingCredentials: signingCredentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
