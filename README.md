# Serverless-CRUD Coffee Shop

1. GET list of all coffees:- 
    url - https://pob4m0z6jk.execute-api.us-east-1.amazonaws.com/coffee

2. GET Details of particular coffee:-
    url - https://pob4m0z6jk.execute-api.us-east-1.amazonaws.com/coffee/coffee102

3. POST new coffee (same coffeeId can't be posted twice):-
    url:- https://pob4m0z6jk.execute-api.us-east-1.amazonaws.com/coffee
    body:-   { "coffeeId": "coffee108", "name": "Special Coffee", "price": "$45", "available": "true" }

4. PUT update existing coffee's name, price or availability 
    url:- https://pob4m0z6jk.execute-api.us-east-1.amazonaws.com/coffee/coffee108
    body:-   { "name": "Super Special Coffee", "price": "$54", "available": "true" }

5. DELETE existing coffee
    url:- https://pob4m0z6jk.execute-api.us-east-1.amazonaws.com/coffee/coffee108


endpoints:
  GET - https://pob4m0z6jk.execute-api.us-east-1.amazonaws.com/coffee
  GET - https://pob4m0z6jk.execute-api.us-east-1.amazonaws.com/coffee/{id}
  POST - https://pob4m0z6jk.execute-api.us-east-1.amazonaws.com/coffee
  PUT - https://pob4m0z6jk.execute-api.us-east-1.amazonaws.com/coffee/{id}
  DELETE - https://pob4m0z6jk.execute-api.us-east-1.amazonaws.com/coffee/{id}

functions:
  getCoffee:CRUD-APP-dev-getCoffee                                                                              
  createCoffee:CRUD-APP-dev-createCoffee
  updateCoffee:CRUD-APP-dev-updateCoffee
  deleteCoffee: CRUD-APP-dev-deleteCoffee 


