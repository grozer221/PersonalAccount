﻿namespace PersonalAccount.Server.Modules.Users;

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
        user.Group = await _scheduleService.GetRandomGroupAsync();
        await base.CreateAsync(user);
        return user;

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
    
    public async Task<UserModel> UpdateExpoPushTokenAsync(Guid userId, string? token)
    {
        UserModel user = await base.GetByIdAsync(userId);
        user.ExpoPushToken = token;
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<UserModel> UpdateGroupAsync(Guid userId, string group, int? subGroup = null)
    {
        UserModel user = await base.GetByIdAsync(userId, u => u.PersonalAccount);
        user.Group = (user.PersonalAccount == null) ? group : user.Group;
        user.SubGroup = subGroup ?? user.SubGroup;
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<UserModel> UpdateEnglishSubGroupAsync(Guid userId, int englishSubGroup)
    {
        UserModel user = await base.GetByIdAsync(userId);
        user.EnglishSubGroup = englishSubGroup;
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<UserModel> UpdateMinutesBeforeLessonNotification(Guid userId, int minutesBeforeLessonNotification, int minutesBeforeLessonsNotification)
    {
        UserModel user = await base.GetByIdAsync(userId);
        user.MinutesBeforeLessonNotification = minutesBeforeLessonNotification;
        user.MinutesBeforeLessonsNotification = minutesBeforeLessonsNotification;
        await _context.SaveChangesAsync();
        return user;
    }
}