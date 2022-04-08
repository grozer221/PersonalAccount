namespace PersonalAccount.Server.Modules.Notifications;

public class NotificationRepository : BaseRepository<NotificationModel>
{
    private readonly AppDbContext _context;

    public NotificationRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }
}
