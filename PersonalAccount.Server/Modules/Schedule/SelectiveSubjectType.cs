using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Schedule;

public class SelectiveSubjectType : ObjectGraphType<SelectiveSubject>
{
    public SelectiveSubjectType()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
           .Name("Name")
           .Resolve(context => context.Source.Name);

        Field<NonNullGraphType<BooleanGraphType>, bool>()
           .Name("IsSelected")
           .Resolve(context => context.Source.IsSelected);
    }
}
