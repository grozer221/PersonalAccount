using Microsoft.EntityFrameworkCore;
using PersonalAccount.Server.Database.Models;
using PersonalAccount.Server.Requests;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PersonalAccount.Server.Database
{
    public class AppDatabaseContext : DbContext
    {
        public AppDatabaseContext(DbContextOptions<AppDatabaseContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Models.PersonalAccount> PersonalAccounts { get; set; }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<ChatModel>()
        //        .HasOne(a => a.PersonalAccount).WithOne(c => c.Chat)
        //        .HasForeignKey<PersonalAccountModel>(p => p.Id);
        //}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            builder.Entity<User>().Property(u => u.Role).HasDefaultValue(RoleEnum.User);
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
                    ((BaseModel)entity.Entity).CreatedAt = now;
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
