

## Déployer le cluster ECS

````
# Création du cluster et des machines
AWS_PROFILE=xebia-dev stack_master apply eu-west-1 jpinsolle-ecs-cluster

# Grafana
AWS_PROFILE=xebia-dev stack_master apply eu-west-1 jpinsolle-ecs-grafana

````

## Step Functions

````
# Login à ECS
$(AWS_PROFILE=xebia-dev aws ecr get-login --region eu-west-1)

# Build docker
cd stepfunctions/custom_activity
docker build -t jpinsolle/activity-hello .
docker tag jpinsolle/activity-hello:latest 010154155802.dkr.ecr.eu-west-1.amazonaws.com/jpinsolle/activity-hello:latest

# Push
docker push 010154155802.dkr.ecr.eu-west-1.amazonaws.com/jpinsolle/activity-hello:latest
````
