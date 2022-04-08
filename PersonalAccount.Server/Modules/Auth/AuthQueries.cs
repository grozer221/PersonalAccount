using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.Modules.Auth.DTO;

namespace PersonalAccount.Server.Modules.Auth;

public class AuthQueries : ObjectGraphType, IQueryMarker
{
    public AuthQueries(UserRepository usersRepository, IHttpContextAccessor httpContextAccessor, AuthService authService)
    {
        Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
            .Name("Me")
            .Argument<StringGraphType, string?>("ExpoPushToken", "Argument for set Expo Push Token")
            .ResolveAsync(async context =>
            {
                Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                string? expoPushToken = context.GetArgument<string?>("ExpoPushToken");

                UserModel currentUser;
                if (expoPushToken == null)
                    currentUser = await usersRepository.GetByIdAsync(userId);
                else
                    currentUser = await usersRepository.UpdateExpoPushTokenAsync(userId, expoPushToken);

                return new AuthResponse()
                {
                    Token = authService.GenerateAccessToken(currentUser.Id, currentUser.Email, currentUser.Role),
                    User = currentUser,
                };
            })
            .AuthorizeWith(AuthPolicies.Authenticated);
    }
}
