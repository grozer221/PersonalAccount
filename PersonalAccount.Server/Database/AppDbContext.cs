using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace PersonalAccount.Server.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        Database.Migrate();
    }

    public DbSet<UserModel> Users { get; set; }
    public DbSet<NotificationModel> Notifications { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(Environment.GetEnvironmentVariable("DATABASE_URL") ?? "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=PersonalAccount;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<NotificationModel>().Property(n => n.Subject)
            .HasConversion(
                subject => subject == null ? null : JsonConvert.SerializeObject(subject),
                str => string.IsNullOrEmpty(str) ? null : JsonConvert.DeserializeObject<Subject>(str));

        builder.Entity<UserModel>().Property(u => u.Settings)
            .HasConversion(
                settings => settings == null ? null : JsonConvert.SerializeObject(settings),
                str => string.IsNullOrEmpty(str) ? null : JsonConvert.DeserializeObject<UserSettings>(str));

        builder.Entity<UserModel>().HasIndex(u => u.Email).IsUnique();
        builder.Entity<UserModel>().Property(u => u.Role).HasDefaultValue(RoleEnum.User);
        builder.Entity<UserModel>().Property(u => u.Settings).HasDefaultValue(new UserSettings
        {
            SubGroup = 1,
            EnglishSubGroup = 1,
            MinutesBeforeLessonNotification = 5,
            MinutesBeforeLessonsNotification = 20,
        });
        builder.Entity<UserModel>().HasMany(u => u.Notifications).WithOne(n => n.User).OnDelete(DeleteBehavior.Cascade);
    }

    public override int SaveChanges()
    {
        AddTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        AddTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void AddTimestamps()
    {
        var entities = ChangeTracker.Entries()
            .Where(x => x.Entity is BaseModel && (x.State == EntityState.Added || x.State == EntityState.Modified));
        foreach (var entity in entities)
        {
            DateTime now = DateTime.UtcNow;
            now = TimeZoneInfo.ConvertTime(now, TimeZoneInfo.FindSystemTimeZoneById("FLE Standard Time"));
            if (entity.State == EntityState.Added)
            {
                ((BaseModel)entity.Entity).Id = Guid.NewGuid();
                ((BaseModel)entity.Entity).CreatedAt = now;
            }
            ((BaseModel)entity.Entity).UpdatedAt = now;
        }
    }
}
