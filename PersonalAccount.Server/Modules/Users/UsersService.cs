using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace PersonalAccount.Server.Modules.Users;

public class UsersService
{
    private readonly ISubject<UserModel> _addUserStream;

    public UsersService()
    {
        _addUserStream = new ReplaySubject<UserModel>(1);
    }
    public void AddUser(UserModel user) => _addUserStream.OnNext(user);
    public IObservable<UserModel> UserAddedSubscribe() => _addUserStream.AsObservable();
}
