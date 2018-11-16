# Liberia SMS Library

This was a project for the [UTD EPICS program](https://epics.utdallas.edu/) back in 2016ish. The project partner was a nonprofit
doing work in Liberia - they wanted a new system for people to interact with the library system with their phones over SMS since 
phones are more common and cell access more readily available than hardline/wireless internet. The system was intended to support the ability 
of people to exchange books directly between themselves without them having to travel to the physical library and check the book back in and out. 

Unfortunately, the project partner abandoned the project halfway through the semester and thus it never got to really be completed and put into prod. 

That being said, if anyone wants to play with this, have at it. SMS messages are handled by using text to email which we never got working consistently - 
we were intending to get a phone number and a sim card dongle to get rid of the text to email requirement. Responses are handled by using an email to text mechanism. 

This was one of my first actual projects beyond just making random stuff for myself - and I feel it definitely shows in the code and commit messages. 

This is open for anyone to take a crack at improving - I would very much like to know if anyone ever deploys it in production somewhere!

This uses versions of things that are outdated - make sure to update these because there may be security patches. I've commented out/left blank areas that are deployment specific configuration.