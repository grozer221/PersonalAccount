using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.Modules.Auth.DTO;

namespace PersonalAccount.Server.Modules.Auth;

public class AuthMutations : ObjectGraphType, IMutationMarker
{
    public AuthMutations(UserRepository usersRepository, AuthService authService, IHttpContextAccessor httpContextAccessor, NotificationsService notificationsService)
    {
        Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
            .Name("Login")
            .Argument<NonNullGraphType<AuthLoginInputType>, AuthLoginInput>("AuthLoginInputType", "Argument for login User")
            .Resolve(context =>
            {
                AuthLoginInput authLoginInput = context.GetArgument<AuthLoginInput>("AuthLoginInputType");
                UserModel? user = usersRepository.GetByEmailOrDefault(authLoginInput.Email);
                if (user == null || user.Password != authLoginInput.Password)
                    throw new Exception("Bad credentials");
                return new AuthResponse()
                {
                    Token = authService.GenerateAccessToken(user.Id, user.Email, user.Role),
                    User = user,
                };
            });

        Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
            .Name("Register")
            .Argument<NonNullGraphType<AuthLoginInputType>, AuthLoginInput>("AuthLoginInputType", "Argument for register User")
            .ResolveAsync(async context =>
            {
                AuthLoginInput authLoginInput = context.GetArgument<AuthLoginInput>("AuthLoginInputType");
                int usersCount = usersRepository.Get().Count;
                UserModel user = new UserModel
                {
                    Email = authLoginInput.Email,
                    Password = authLoginInput.Password,
                    Role = usersCount == 0 ? RoleEnum.Admin : RoleEnum.User
                };
                await usersRepository.CreateAsync(user);
                return new AuthResponse()
                {
                    Token = authService.GenerateAccessToken(user.Id, user.Email, user.Role),
                    User = user
                };
            });

        Field<NonNullGraphType<BooleanGraphType>, bool>()
            .Name("Logout")
            .Argument<BooleanGraphType, bool>("RemoveExpoPushToken", "Argument for logout User")
            .ResolveAsync(async context =>
            {
                bool removeExpoPushToken = context.GetArgument<bool>("RemoveExpoPushToken");
                Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                if (removeExpoPushToken)
                    await usersRepository.UpdateExpoPushTokenAsync(userId, null);
                return true;
            })
            .AuthorizeWith(AuthPolicies.Authenticated);

        Field<NonNullGraphType<BooleanGraphType>, bool>()
            .Name("RemoveMe")
            .ResolveAsync(async context =>
            {
                Guid currentUserId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                notificationsService.RemoveScheduleForUser(currentUserId);
                await usersRepository.RemoveAsync(currentUserId);
                return true;
            })
            .AuthorizeWith(AuthPolicies.Authenticated);
    }
}
