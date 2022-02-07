using PersonalAccount.Server.Database.Models;
using System;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace PersonalAccount.Server.GraphQL.Modules.Users
{
    public class UsersService
    {
        private readonly ISubject<User> _addUserStream;

        public UsersService()
        {
            _addUserStream = new ReplaySubject<User>(1);
        }
        public void AddUser(User user) => _addUserStream.OnNext(user);
        public IObservable<User> UserAddedSubscribe() => _addUserStream.AsObservable();
    }
}
