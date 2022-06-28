using GraphQL;
using GraphQL.Types;
using Microsoft.Extensions.Caching.Memory;
using PersonalAccount.Server.Modules.Auth.DTO;

namespace PersonalAccount.Server.Modules.Auth;

public class AuthQueries : ObjectGraphType, IQueryMarker
{
    public AuthQueries(UserRepository usersRepository, IHttpContextAccessor httpContextAccessor, AuthService authService, IMemoryCache memoryCache)
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
                {
                    if (!memoryCache.TryGetValue($"users/{userId}", out currentUser))
                    {
                        currentUser = await usersRepository.GetByIdAsync(userId);
                        memoryCache.Set($"users/{currentUser.Id}", currentUser, new MemoryCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24),
                        });
                    }
                }
                else
                {
                    currentUser = await usersRepository.UpdateExpoPushTokenAsync(userId, expoPushToken);
                }
                return new AuthResponse()
                {
                    Token = authService.GenerateAccessToken(currentUser.Id, currentUser.Email, currentUser.Role),
                    User = currentUser,
                };
            })
            .AuthorizeWith(AuthPolicies.Authenticated);
    }
}
