namespace PersonalAccount.Server.Modules.Users;

public class UserRepository : BaseRepository<UserModel>
{
    private readonly AppDbContext _context;
    private readonly ScheduleService _scheduleService;


    public UserRepository(AppDbContext context, ScheduleService scheduleService) : base(context)
    {
        _context = context;
        _scheduleService = scheduleService;
    }

    public override async Task<UserModel> CreateAsync(UserModel user)
    {
        List<UserModel> checkUniqueUserEmail = base.Where(u => u.Email == user.Email);
        if (checkUniqueUserEmail.Count > 0)
            throw new Exception("User with current email already exists");
        //user.Settings.Group = await _scheduleService.GetRandomGroupAsync();
        await base.CreateAsync(user);
        return user;

    }

    public override Task<UserModel> UpdateAsync(UserModel user)
    {
        if (user.Settings.SubGroup < 1 || user.Settings.SubGroup > 2)
            throw new Exception("Sub group must be in range 1-2");

        if (user.Settings.EnglishSubGroup < 1 || user.Settings.EnglishSubGroup > 2)
            throw new Exception("Enlish subgroup must be in range 1-2");

        if (user.Settings.MinutesBeforeLessonNotification < 1 || user.Settings.MinutesBeforeLessonNotification > 30)
            throw new Exception("Minutes before lesson notification must be in range 1-30");

        if (user.Settings.MinutesBeforeLessonsNotification < 1 || user.Settings.MinutesBeforeLessonsNotification > 60)
            throw new Exception("Minutes before lessons notification must be in range 1-60");

        return base.UpdateAsync(user);
    }

    public UserModel GetByEmail(string email)
    {
        UserModel? user = GetByEmailOrDefault(email);
        if (user == null)
            throw new Exception("User with current email not found");
        return user;
    }
    
    public UserModel? GetByEmailOrDefault(string email)
    {
        List<UserModel> users = base.Where(u => u.Email == email);
        if (users.Count == 0)
            return null;
        else
            return users[0];
    }
    
    public async Task<UserModel> UpdateSettingsAsync(Guid userId, UserSettings settings)
    {
        UserModel user = await base.GetByIdAsync(userId);
        user.Settings.Group = settings.Group;
        user.Settings.SubGroup = settings.SubGroup;
        user.Settings.EnglishSubGroup = settings.EnglishSubGroup;
        user.Settings.MinutesBeforeLessonNotification = settings.MinutesBeforeLessonNotification;
        user.Settings.MinutesBeforeLessonsNotification = settings.MinutesBeforeLessonsNotification;
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<UserModel> UpdateExpoPushTokenAsync(Guid userId, string? token)
    {
        UserModel user = await base.GetByIdAsync(userId);
        user.Settings.ExpoPushToken = token;
        await _context.SaveChangesAsync();
        return user;
    }
}
