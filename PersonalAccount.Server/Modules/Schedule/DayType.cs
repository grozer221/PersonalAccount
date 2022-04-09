﻿using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Schedule;

public class DayType : ObjectGraphType<Day>
{
    public DayType()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
           .Name("Name")
           .Resolve(context => context.Source.Name);

        Field<NonNullGraphType<ListGraphType<SubjectType>>, List<Subject>>()
           .Name("Subjects")
           .Resolve(context => context.Source.Subjects);
    }
}