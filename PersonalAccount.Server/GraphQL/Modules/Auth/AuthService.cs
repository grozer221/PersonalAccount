using Microsoft.IdentityModel.Tokens;
using PersonalAccount.Server.Database.Models;
using PersonalAccount.Server.Database.Respositories;
using PersonalAccount.Server.GraphQL.Modules.Auth.DTO;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace PersonalAccount.Server.GraphQL.Modules.Auth
{
    public class AuthService
    {
        private readonly UsersRepository _usersRepository;

        public AuthService(UsersRepository usersRepository)
        {
            _usersRepository = usersRepository;
        }

        public async Task<string> Authenticate(AuthLoginInput authLoginInput)
        {
            User user = await _usersRepository.GetByEmailAsync(authLoginInput.Email);
            if (user == null || user.Password != authLoginInput.Password)
                throw new Exception("Bad credensials");
            return GenerateAccessToken(user.Id, user.Email, user.Role);

        }
        
        public async Task<string> Register(AuthLoginInput authLoginInput)
        {
            User user = new User { Email = authLoginInput.Email, Password = authLoginInput.Password };
            user = await _usersRepository.CreateAsync(user);
            return GenerateAccessToken(user.Id, user.Email, user.Role);

        }

        public string GenerateAccessToken(int userId, string userEmail, RoleEnum userRole)
        {
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("AuthIssuerSigningKey")));
            SigningCredentials signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            List<Claim> claims = new List<Claim>
            {
                new Claim(AuthClaimsIdentity.DefaultIdClaimType, userId.ToString()),
                new Claim(AuthClaimsIdentity.DefaultNameClaimType, userEmail),
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
