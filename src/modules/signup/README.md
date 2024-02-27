# Signup Module
The signup module supports user signup to the application. In this module, we handle the
verification process for new accounts. Verification methods are through SMS. This
module also manages the contract process. Every time an affiliate or an employer signs up they
receive a contract.

## Domain Concepts
There are a few useful domain concepts outlined below. These are stored in the _entities_ folder.
- **Signup**: A signup represents a new user who wants to create a new account. This could be
an affiliate, candidate, or employer. The signup holds any contracts, files, or data associated
with the type of signup.
- **Verification**: The verification verifies the user's phone number as correct.

## TODO
- [] Unify verification across employers, candidates, and affiliates. Right now these are all 
handled separately.