

## Démonstration Lambda


### Création lambda (slide 4)
````bash
# Création
zip -j addition.zip addition/*
aws lambda create-function 
  --function-name addition 
  --region eu-west-1 
  --zip-file fileb://addition.zip 
  --role $ROLE_LAMBDA 
  --handler index.add 
  --runtime nodejs4.3
  

# Invocation
aws lambda invoke --function-name addition --payload '{"n1": 4, "n2": 1}' result.txt && cat result.txt

# Suppression (si besoin)
aws lambda delete-function --function-name addition
````


### Versions & Alias (slide 9)

**Alias DEV sur la version $LATEST**
````bash
aws lambda create-alias --function-name addition --name DEV --function-version \$LATEST
````

**Publish version & alias PROD**
````bash
aws lambda publish-version --function-name addition
aws lambda create-alias --function-name addition --name PROD --function-version 3
````

**Modification code & déploiement**
index.js
````javascript
const r = n1 + "" + n2;
````

````bash
zip -j addition.zip addition/*
aws lambda update-function-code --function-name addition --publish --zip-file fileb://addition.zip
````


**Invocation ALIAS**
````
aws lambda invoke --function-name addition:DEV --payload '{"n1": 4, "n2": 1}' result.txt && cat result.txt
aws lambda invoke --function-name addition:PROD --payload '{"n1": 4, "n2": 1}' result.txt && cat result.txt
````

### Serverless (slide 22)
Créer le fichier **serverless.yml** dans le répertoire addition

````yaml
service: OperationService

provider:
  name: aws
  profile: xebia-dev
  region: eu-west-1
  deploymentBucket: jpinsolle-xebia
  runtime: nodejs4.3
  versionFunctions: false

functions:
  addition:
    handler: index.add
    memorySize: 128
    timeout: 10
````

Ajouter une nouvelle lambda

````yaml
functions:
  addition:
    handler: index.add

  substraction:
    handler: index.sub
````

### API Gateway (slide 29)

Exposer la fonction "add" en GET

**serverless.yml**
````yml
functions:
  addition:
    handler: index.add
    events:
     - http:
        path: add
        method: GET
        integration: lambda
        request:
          template:
            application/json: '{ "n1" : $input.params(''n1''), "n2" : $input.params(''n2'') }'
````

**Test**
````bash
curl "API_GATEWAY_URL/dev/add?n1=10&n2=2"
````


Exposer la fonction "sub" en POST

**serverless.yml**
````yaml
substraction:
    handler: index.sub
    events:
     - http:
        path: sub
        method: POST
        integration: lambda
        request:
          template:
            application/json: '{ "n1" : $input.path(''$.n1''), "n2" : $input.path(''$.n2'') }'
````


**Test**
````bash
curl -X POST -H "Content-Type: application/json" -d '{"n1": 10, "n2": 1}' API_GATEWAY_URL/dev/sub
````

### Grafana (slide 34)

````
graph LR
  L1{Lambda1}-->sqs_nb_msg((SQS))
  L1-->s3_nb_obj(S3)
  sqs_nb_msg-->lambda2{Lambda2}
````

![](grafana-metrics.png)


## Démonstration Step Functions

### HelloWorld
Création via la console. Appel de la lambda addition déjà définie
**State Machine**
````
{
  "Comment": "HelloWorld state machine for the XKE",
  "StartAt": "Addition",
  "States": {
    "Addition": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:eu-west-1:010154155802:function:addition",
      "End": true
    }
  }
}
````

**Start Execution**
````
{ "n1": 7, "n2": 2 }
````


### Exposition via API Gateway
Réutilisation de l'API Gateway des lambdas

**1 - Création d'une resource**
![](stepfunctions-createresource.png)

**2 - Création d'une méthode**
![](stepfunctions-createmethod.png)

**3 - Déployer l'API**

**4 - Appeler la step functions**
````
# Appel
curl -X POST -d '{
"input": "{\"n1\": 3, \"n2\": 4}",
"name": "ExecutionWithAPIGateway1",
"stateMachineArn": "arn:aws:states:eu-west-1:010154155802:stateMachine:StepFunctionsAddition"
}' https://fxdimu7fwf.execute-api.eu-west-1.amazonaws.com/dev/stepfunctions

# Réponse
{"executionArn":"XXX:StepFunctionsAddition:ExecutionWithAPIGateway1", "startDate":1.489350632476E9}
````

Pas de mécanisme synchrone comme les lambdas. Donc pas moyen de récupérer le résultat de l'appel.

### Activité
````
{
  "StartAt": "HelloWorld",
  "States": {
    "HelloWorld": {
      "Type": "Task",
      "Resource": "arn:aws:states:eu-west-1:010154155802:activity:jpinsolle-helloworld",
      "End": true
    }
  }
}

````

### Gestion des erreurs

stepfunctions-errors
````
{ "type": "generic-error" }
{ "type": "custom-error" }
{ "type": "timeout" }
````