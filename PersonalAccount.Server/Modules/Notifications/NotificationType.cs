using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Notifications;

public class NotificationType : BaseType<NotificationModel>
{
    public NotificationType() : base()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
           .Name("Title")
           .Resolve(context => context.Source.Title);
        
        Field<NonNullGraphType<StringGraphType>, string>()
           .Name("Body")
           .Resolve(context => context.Source.Body);
        
        Field<SubjectType, Subject?>()
           .Name("Subject")
           .Resolve(context => context.Source.Subject);
    }
}
