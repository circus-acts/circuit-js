[![Build Status](https://travis-ci.org/philtoms/circus.svg?branch=master)](https://travis-ci.org/philtoms/circus)

# circus

An MVI frp library for JavaScript

Circus takes an event such as a keypress and maps it onto a signal whose value change descretely over time. Signals can be connected together to form logical cicuits that can be reasoned sequentially making it easier to understand the overall state of a program at any given point in time. 

Circus also provides 

Circus uses established functional patterns like map, reduce and merge to transform signal values from one signal to another. Using these terms complex circuits can be constructed from simple descrete and testable units of code.


## Installation
 ```shell
npm install --save-dev circus
```

## Hot or cold?
If you had to describe Circus in terms of hot or cold observables, it would be hot by default. That is to say, Circus signals always provide the latest value. 

### Copyright

Source code is licensed under the MIT License (MIT). See [LICENSE.txt](./LICENSE.txt)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license. 


