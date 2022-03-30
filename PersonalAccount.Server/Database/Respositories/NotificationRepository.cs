namespace PersonalAccount.Server.Database.Respositories
{
    public class NotificationRepository : BaseRepository<NotificationModel>
    {
        private readonly AppDbContext _context;

        public NotificationRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }
    }
}
