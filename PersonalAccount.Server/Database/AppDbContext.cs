using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace PersonalAccount.Server.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        Database.Migrate();
    }

    public DbSet<UserModel> Users { get; set; }
    public DbSet<NotificationModel> Notifications { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(GetConnectionString());
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

    private string GetConnectionString()
    {
        string connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
        if (string.IsNullOrEmpty(connectionString))
            connectionString = "Host=localhost;Port=5432;Database=personal-account;Username=postgres;Password=";
        else
        {
            connectionString = connectionString.Split("//")[1];
            string user = connectionString.Split(':')[0];
            connectionString = connectionString.Replace(user, "").Substring(1);
            string password = connectionString.Split('@')[0];
            connectionString = connectionString.Replace(password, "").Substring(1);
            string server = connectionString.Split(':')[0];
            connectionString = connectionString.Replace(server, "").Substring(1);
            string port = connectionString.Split('/')[0];
            string database = connectionString.Split('/')[1];
            connectionString = $"Host={server};Port={port};Database={database};Username={user};Password={password}";
        }
        return connectionString;
    }
}
