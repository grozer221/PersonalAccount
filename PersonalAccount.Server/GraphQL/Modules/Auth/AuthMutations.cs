using GraphQL;
using GraphQL.Types;
using PersonalAccount.Server.GraphQL.Modules.Auth.DTO;

namespace PersonalAccount.Server.GraphQL.Modules.Auth
{
    public class AuthMutations : ObjectGraphType, IMutationMarker
    {
        public AuthMutations(UsersRepository usersRepository, AuthService authService, IHttpContextAccessor httpContextAccessor)
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
                    UserModel user = new UserModel { Email = authLoginInput.Email, Password = authLoginInput.Password };
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
                    if(removeExpoPushToken)
                        await usersRepository.UpdateExpoPushTokenAsync(userId, null);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
