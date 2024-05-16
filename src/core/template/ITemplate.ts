/**
 * This interface defines a contract that implementors of ITemplate need to meet. We can then depend on the interface
 * rather than the actual service if for instance we decide to switch from Handlbars. This is simply an adaptor pattern.
 */

export interface ITemplate
{
    render(template: string, binds: {}): Promise<string>;
}
