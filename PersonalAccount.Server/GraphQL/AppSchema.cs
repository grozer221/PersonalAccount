using GraphQL.Types;

namespace PersonalAccount.Server.GraphQL;

public class AppSchema : Schema
{
    public AppSchema(IServiceProvider provider) : base(provider)
    {
        Query = provider.GetRequiredService<Queries>();
        Mutation = provider.GetRequiredService<Mutations>();
        Subscription = provider.GetRequiredService<Subscriptions>();
    }
}
