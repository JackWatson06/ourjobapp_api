# Payment Module
When an employer hires someone on OurJob.App they pay a flat fee to do so. This fee comes from them
using the platform to find a candidate that works best for them. OurJob.App also provides an
affiliate link program where people who refer other parties can generate income. For instance, if we 
create an affiliate account and then refer an employer, once the employer hires someone you can get 
25% of the flat fee. A similar process occurs for candidates. Additionally, nested affiliates can 
get money. If you referred an affiliate then you could get 7.5% of the final payout.
We only support a hierarchy of two affiliates meaning that a total of 4 affiliates could receive 
payment during a hiring event. 

## Domain Concepts
There are a few domain concepts stored in the _entities_ folder which are discussed below.
- **Payment**: The payment represents a payment that an employer would like to go through to hire a
candidate.
- **PaymentRequest**: A payment request represents an employer's intentions to hire a candidate. 
- **Payout**: A payout represents any money going from the flat fee to an affiliate.
