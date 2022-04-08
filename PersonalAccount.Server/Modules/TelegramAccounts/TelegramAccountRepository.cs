namespace PersonalAccount.Server.Modules.TelegramAccounts;

public class TelegramAccountRepository : BaseRepository<TelegramAccountModel>
{
    private readonly AppDbContext _context;
    public TelegramAccountRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }
}
