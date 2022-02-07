using GraphQL;
using GraphQL.Server;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using PersonalAccount.Server.Database;
using PersonalAccount.Server.Database.Models;
using PersonalAccount.Server.Database.Respositories;
using PersonalAccount.Server.GraphQL;
using PersonalAccount.Server.GraphQL.Abstraction;
using PersonalAccount.Server.GraphQL.Modules.Auth;
using PersonalAccount.Server.GraphQL.Modules.Users;
using System;
using System.Security.Claims;
using System.Text;

namespace PersonalAccount.Server
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<AppDatabaseContext>(options => options.UseMySQL(AppDatabaseContext.GetConnectionString()));
            services.AddScoped<UsersRepository>();

            services.AddAuthentication(options =>
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
            services.AddAuthorization();

            services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<IDocumentExecuter, SubscriptionDocumentExecuter>();

            services.AddTransient<IQueryMarker, UsersQueries>();
            services.AddTransient<IMutationMarker, UsersMutations>();
            services.AddTransient<ISubscriptionMarker, UsersSubscriptions>();
            services.AddSingleton<UsersService>();

            services.AddTransient<IQueryMarker, AuthQueries>();
            services.AddTransient<IMutationMarker, AuthMutations>();
            services.AddTransient<AuthService>();

            services.AddTransient<AppSchema>();
            services
                .AddGraphQL(options => options.EnableMetrics = true)
                .AddSystemTextJson()
                .AddWebSockets()
                .AddDataLoader()
                .AddGraphTypes(typeof(AppSchema), ServiceLifetime.Transient)
                .AddGraphQLAuthorization(options =>
                {
                    options.AddPolicy(AuthPolicies.Authenticated.ToString(), p => p.RequireAuthenticatedUser());
                    options.AddPolicy(AuthPolicies.Admin, p => p.RequireClaim(ClaimTypes.Role, RoleEnum.Admin.ToString()));
                    options.AddPolicy(AuthPolicies.User, p => p.RequireClaim(ClaimTypes.Role, RoleEnum.User.ToString()));
                })
                .AddErrorInfoProvider(options => options.ExposeExceptionStackTrace = true);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseWebSockets();
            app.UseGraphQLWebSockets<AppSchema>();
            app.UseGraphQL<AppSchema>();
            app.UseGraphQLAltair();
        }
    }
}
