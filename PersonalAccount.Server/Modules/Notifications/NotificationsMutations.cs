using GraphQL;
using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Notifications;

public class NotificationsMutations : ObjectGraphType, IMutationMarker
{
    public NotificationsMutations(NotificationRepository notificationRepository, UserRepository userRepository, NotificationsService notificationsService)
    {
        Field<NonNullGraphType<BooleanGraphType>, bool>()
           .Name("BroadcastMessage")
           .Argument<NonNullGraphType<StringGraphType>, string>("Message", "Argument for Broadcast message")
           .ResolveAsync(async context =>
           {
               string title = "Notification";
               string message = $"<i>{context.GetArgument<string>("Message")}</i>";

               NotificationModel notification = new NotificationModel
               {
                   Title = title,
                   Body = message,
               };
               await notificationRepository.CreateAsync(notification);
               List<UserModel> users = userRepository.Get(u => u.TelegramAccount);
               foreach (var user in users)
               {
                   await notificationsService.SendNotificationInAllWaysAsync(title, message, null, user.TelegramAccount?.TelegramId, user.ExpoPushToken);
               }
               return true;
           })
           .AuthorizeWith(AuthPolicies.Admin);
    }
}
