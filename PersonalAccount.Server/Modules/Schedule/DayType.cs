using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Schedule;

public class DayType : ObjectGraphType<Day>
{
    public DayType()
    {
        Field<NonNullGraphType<IntGraphType>, int>()
           .Name("Number")
           .Resolve(context => context.Source.Number);
        
        Field<StringGraphType, string?>()
           .Name("ExtraText")
           .Resolve(context => context.Source.ExtraText);
        
        Field<NonNullGraphType<StringGraphType>, string>()
           .Name("Name")
           .Resolve(context => context.Source.Name);

        Field<NonNullGraphType<ListGraphType<SubjectType>>, IEnumerable<Subject>>()
           .Name("Subjects")
           .Resolve(context => context.Source.Subjects);
    }
}
