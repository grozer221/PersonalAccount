namespace PersonalAccount.Server.Database.Respositories
{
    public class TelegramAccountRepository : BaseRepository<TelegramAccountModel>
    {
        private readonly AppDbContext _context;
        private readonly UserRepository _userRepository;
        public TelegramAccountRepository(AppDbContext context, UserRepository userRepository) : base(context)
        {
            _context = context;
            _userRepository = userRepository;
        }

        public override async Task<TelegramAccountModel> UpdateAsync(TelegramAccountModel telegramAccount)
        {
            UserModel user = await _userRepository.GetByIdAsync(telegramAccount.UserId, u => u.TelegramAccount);
            if (user.TelegramAccount == null)
                user.TelegramAccount = new TelegramAccountModel();
            user.TelegramAccount.TelegramId = telegramAccount.TelegramId;
            user.TelegramAccount.Username = telegramAccount.Username;
            user.TelegramAccount.Firstname = telegramAccount.Firstname;
            user.TelegramAccount.Lastname = telegramAccount.Lastname;
            user.TelegramAccount.PhotoUrl = telegramAccount.PhotoUrl;
            user.TelegramAccount.Hash = telegramAccount.Hash;
            user.TelegramAccount.AuthDate = telegramAccount.AuthDate;
            user.TelegramAccount.UserId = telegramAccount.UserId;
            await _context.SaveChangesAsync();
            return user.TelegramAccount;
        }
    }
}
