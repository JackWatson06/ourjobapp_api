# Signup Module
The signup module supports the transactinos that occurs for a user to signup. In this module we are responsible for handling 
the verification process by sending out an email as well as allowing data to be inputed into our application.

## How It Works
Lets use the affiliate as an example. So an affiliate enters there data into our site and it will go to the affiliates
collection. In this collection we then have a tokenId which holds a reference to a token of the verification email that
goes out. Then when the email is verified by the client they will send a verification token back.

## TODO
- Right now each the employer, employee, and affiliate all handle there own verification process. This is not ideal since it 
adds additional duplicate code. Right now though I need to move on but we will want to come back in the future to really
look in depth for how to structure this process and make it better coded. Also spliting up the database in two parts where
one represents the unverified and the other represents the verified would be beneficial even just in terms of query preformance.
Right now I am on the clock need to keep on moving... Sorry whoever has to deal with this in the future.
- This code is actually real bad. Please update soonish. We need to split off the verification part into a seperate domain entity.