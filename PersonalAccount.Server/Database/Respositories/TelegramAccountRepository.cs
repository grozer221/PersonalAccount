namespace PersonalAccount.Server.Database.Respositories
{
    public class TelegramAccountRepository : BaseRepository<TelegramAccountModel>
    {
        private readonly AppDbContext _context;
        public TelegramAccountRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }
    }
}
