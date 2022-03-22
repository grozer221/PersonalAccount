﻿using GraphQL.Types;

namespace PersonalAccount.Server.GraphQL.Modules.Users
{
    public class UsersQueries : ObjectGraphType, IQueryMarker
    {
        public UsersQueries(UsersRepository usersRepository)
        {
            Field<NonNullGraphType<ListGraphType<UserType>>, List<UserModel>>()
                .Name("GetUsers")
                .ResolveAsync(async context => await usersRepository.GetAsync());
        }
    }
}
