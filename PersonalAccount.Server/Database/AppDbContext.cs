using Microsoft.EntityFrameworkCore;

namespace PersonalAccount.Server.Database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            Database.Migrate();
        }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<PersonalAccountModel> PersonalAccounts { get; set; }
        public DbSet<NotificationModel> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<UserModel>().HasIndex(u => u.Email).IsUnique();
            builder.Entity<UserModel>().Property(u => u.Role).HasDefaultValue(RoleEnum.User);
            builder.Entity<UserModel>().Property(u => u.SubGroup).HasDefaultValue(1);

            builder.Entity<UserModel>().HasMany(u => u.Notifications).WithOne(n => n.User).OnDelete(DeleteBehavior.SetNull);
            builder.Entity<PersonalAccountModel>().HasOne(a => a.User).WithOne(u => u.PersonalAccount).OnDelete(DeleteBehavior.SetNull);
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
                var now = DateTime.Now;
                if (entity.State == EntityState.Added)
                {
                    ((BaseModel)entity.Entity).Id = Guid.NewGuid();
                    ((BaseModel)entity.Entity).CreatedAt = now;
                }
                ((BaseModel)entity.Entity).UpdatedAt = now;
            }
        }

        public static string GetConnectionString()
        {
            string connectionString = Environment.GetEnvironmentVariable("JAWSDB_URL");
            if (string.IsNullOrEmpty(connectionString))
                connectionString = "server=localhost;user=root;password=;database=personal-account;";
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
                connectionString = $"server={server};database={database};user={user};password={password};port={port}";
            }
            return connectionString;
        }
    }
}
