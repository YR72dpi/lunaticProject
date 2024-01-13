# Tests

you have a command for testing the timing for _x_ query : 
```shell
node ./src/Command/timePerfCommand.js
```

You can change the number of query here

```javascript
const nbrTest = 100
```

Output :

```text
---- ----
QUERY : /api/getNo query
Number of query : 100
MOY : 4.49 ms
MIN : 1 ms
MAX : 52 ms
---- ----
QUERY : /api/get?min=1&max=10
Number of query : 100
MOY : 112.44 ms
MIN : 1 ms
MAX : 682 ms
---- ----
QUERY : /api/get?function=numberFromDb
Number of query : 100
MOY : 11.88 ms
MIN : 7 ms
MAX : 168 ms
---- ----
QUERY : /api/get?function=simpleRandom
Number of query : 100
MOY : 1.43 ms
MIN : 1 ms
MAX : 4 ms
---- ----
QUERY : /api/get?function=crossRandom
Number of query : 100
MOY : 1.76 ms
MIN : 0 ms
MAX : 4 ms
---- ----
QUERY : /api/get?function=randomLowEntropy
Number of query : 100
MOY : 1.31 ms
MIN : 0 ms
MAX : 4 ms
---- ----
QUERY : /api/get?function=randomMediumEntropy
Number of query : 100
MOY : 1.33 ms
MIN : 0 ms
MAX : 5 ms
---- ----
QUERY : /api/get?function=randomHighEntropy
Number of query : 100
MOY : 1.31 ms
MIN : 0 ms
MAX : 4 ms
---- ----
QUERY : /api/get?function=generateRandomNumberFromTimestamp
Number of query : 100
MOY : 1.31 ms
MIN : 0 ms
MAX : 4 ms
---- ----
QUERY : /api/get?function=vonNeumannRandom
Number of query : 100
MOY : 1.24 ms
MIN : 0 ms
MAX : 5 ms
```