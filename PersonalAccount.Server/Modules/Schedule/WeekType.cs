using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Schedule;

public class WeekType : ObjectGraphType<Week>
{
    public WeekType()
    {
        Field<NonNullGraphType<IntGraphType>, int>()
            .Name("Number")
            .Resolve(context => context.Source.Number);

        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Name")
            .Resolve(context => context.Source.Name);

        Field<NonNullGraphType<ListGraphType<DayType>>, IEnumerable<Day>>()
            .Name("Days")
            .Resolve(context => context.Source.Days);
    }
}
