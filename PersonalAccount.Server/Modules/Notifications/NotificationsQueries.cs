using GraphQL;
using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Notifications;

public class NotificationsQueries : ObjectGraphType, IQueryMarker
{
    public NotificationsQueries(IHttpContextAccessor httpContextAccessor, NotificationRepository notifcationRepository)
    {
        Field<NonNullGraphType<GetEntitiesResponseType<NotificationType, NotificationModel>>, GetEntitiesResponse<NotificationModel>>()
            .Name("GetMyNotifications")
            .Argument<IntGraphType, int?>("Page", "Argument for get My Notifications")
            .Resolve(context =>
            {
                Guid userId = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
                int? page = context.GetArgument<int?>("Page");
                return notifcationRepository.Get(n => n.CreatedAt, Order.Ascend, page ?? 1, n => n.UserId == userId || n.UserId == null);
            })
            .AuthorizeWith(AuthPolicies.Authenticated);
    }
}
