using GraphQL.Types;

namespace PersonalAccount.Server.GraphQL.Abstraction
{
    public class BaseType<T> : ObjectGraphType<T> where T : BaseModel
    {
        public BaseType()
        {
            Field<NonNullGraphType<IdGraphType>, Guid>()
               .Name("Id")
               .Resolve(context => context.Source.Id);

            Field<NonNullGraphType<DateTimeGraphType>, DateTime>()
                .Name("CreatedAt")
                .Resolve(context => context.Source.CreatedAt);

            Field<NonNullGraphType<DateTimeGraphType>, DateTime>()
               .Name("UpdatedAt")
               .Resolve(context => context.Source.UpdatedAt);
        }
    }
}
