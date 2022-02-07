using Microsoft.EntityFrameworkCore;
using PersonalAccount.Server.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PersonalAccount.Server.Database.Respositories
{
    public class UsersRepository
    {
        private readonly AppDatabaseContext _ctx;

        public UsersRepository(AppDatabaseContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<User>> GetAsync(int skip = 0, int take = 10)
        {
            return await _ctx.Users.Skip(skip).Take(take).ToListAsync();
        }

        public async Task<User> GetByIdAsync(int userId)
        {
            return await _ctx.Users.FindAsync(userId);
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _ctx.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> CreateAsync(User user)
        {
            User checkUser = await _ctx.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (checkUser != null)
                throw new Exception("User with current email already exists");
            _ctx.Users.Add(user);
            await _ctx.SaveChangesAsync();
            return user;
        }
    }
}
