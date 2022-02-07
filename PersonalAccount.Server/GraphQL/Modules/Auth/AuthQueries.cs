using GraphQL;
using GraphQL.Types;
using Microsoft.AspNetCore.Http;
using PersonalAccount.Server.Database.Models;
using PersonalAccount.Server.Database.Respositories;
using PersonalAccount.Server.GraphQL.Abstraction;
using PersonalAccount.Server.GraphQL.Modules.Auth.DTO;

namespace PersonalAccount.Server.GraphQL.Modules.Auth
{
    public class AuthQueries : ObjectGraphType, IQueryMarker
    {
        public AuthQueries(UsersRepository usersRepository, IHttpContextAccessor httpContextAccessor, AuthService authService)
        {
            Field<AuthResponseType>()
                .Name("isAuth")
                .ResolveAsync(async context =>
                {
                    string userEmail = httpContextAccessor.HttpContext.User.Identity.Name;
                    User currentUser = await usersRepository.GetByEmailAsync(userEmail);
                    return new AuthModel()
                    {
                        Token = authService.GenerateAccessToken(currentUser.Id, currentUser.Email, currentUser.Role),
                        User = currentUser,
                    };
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
