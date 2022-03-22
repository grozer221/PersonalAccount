using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.GraphQL.Modules.Auth.DTO;

namespace PersonalAccount.Server.GraphQL.Modules.Auth
{
    public class AuthQueries : ObjectGraphType, IQueryMarker
    {
        public AuthQueries(UsersRepository usersRepository, IHttpContextAccessor httpContextAccessor, AuthService authService)
        {
            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("IsAuth")
                .ResolveAsync(async context =>
                {
                    Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                    UserModel currentUser = await usersRepository.GetByIdAsync(userId);
                    return new AuthResponse()
                    {
                        Token = authService.GenerateAccessToken(currentUser.Id, currentUser.Email, currentUser.Role),
                        User = currentUser,
                    };
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
