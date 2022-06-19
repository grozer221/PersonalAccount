using GraphQL;
using GraphQL.Server;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultPolicy", builder =>
    {
        builder.AllowAnyHeader()
               .WithMethods("POST")
               .WithOrigins("http://localhost:3000");
    });
});

builder.Services.AddControllers()
    .AddNewtonsoftJson();

builder.Services.AddDbContext<AppDbContext>(ServiceLifetime.Scoped);

builder.Services.AddAuthentication(options =>
{
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateAudience = true,
        ValidateIssuer = true,
        ValidateIssuerSigningKey = true,
        ValidAudience = Environment.GetEnvironmentVariable("AuthValidAudience"),
        ValidIssuer = Environment.GetEnvironmentVariable("AuthValidIssuer"),
        RequireSignedTokens = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("AuthIssuerSigningKey"))),
    };
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
});

builder.Services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddTransient<IDocumentExecuter, SubscriptionDocumentExecuter>();

builder.Services.AddTransient<IQueryMarker, AuthQueries>();
builder.Services.AddTransient<IMutationMarker, AuthMutations>();
builder.Services.AddTransient<AuthService>();

builder.Services.AddTransient<IQueryMarker, NotificationsQueries>();
builder.Services.AddTransient<IMutationMarker, NotificationsMutations>();
builder.Services.AddSingleton<NotificationsService>();
builder.Services.AddHostedService<NotificationsService>();
builder.Services.AddScoped<NotificationRepository>();

builder.Services.AddTransient<IMutationMarker, PersonalAccountsMutations>();
builder.Services.AddSingleton<PersonalAccountService>();
builder.Services.AddHostedService<PersonalAccountService>();
builder.Services.AddSingleton<PersonalAccountParsers>();

builder.Services.AddTransient<IQueryMarker, ScheduleQueries>();
builder.Services.AddSingleton<ScheduleService>();
builder.Services.AddSingleton<ScheduleParsers>();

builder.Services.AddTransient<IMutationMarker, TelegramAccountsMutations>();

builder.Services.AddTransient<IQueryMarker, UsersQueries>();
builder.Services.AddTransient<IMutationMarker, UsersMutations>();
builder.Services.AddTransient<ISubscriptionMarker, UsersSubscriptions>();
builder.Services.AddSingleton<UsersService>();
builder.Services.AddScoped<UserRepository>();

builder.Services.AddTransient<AppSchema>();
builder.Services
     .AddGraphQL(options =>
     {
         options.EnableMetrics = true;
         options.UnhandledExceptionDelegate = (context) =>
         {
             Console.WriteLine("StackTrace: " + context.Exception.StackTrace);
             Console.WriteLine("Message: " + context.Exception.Message);
             context.ErrorMessage = context.Exception.Message;
         };
     })
    .AddSystemTextJson()
    .AddGraphTypes(typeof(AppSchema), ServiceLifetime.Transient)
    .AddGraphQLAuthorization(options =>
    {
        options.AddPolicy(AuthPolicies.Authenticated.ToString(), p => p.RequireAuthenticatedUser());
        options.AddPolicy(AuthPolicies.User, p => p.RequireClaim(ClaimTypes.Role, RoleEnum.User.ToString(), RoleEnum.Admin.ToString()));
        options.AddPolicy(AuthPolicies.Admin, p => p.RequireClaim(ClaimTypes.Role, RoleEnum.Admin.ToString()));
    });



var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseCors("DefaultPolicy");
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{id?}");

app.UseGraphQL<AppSchema>();
app.UseGraphQLAltair();

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "wwwroot";
});

app.Run();
