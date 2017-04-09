````
# ECR login
$(aws ecr get-login --region eu-west-1)

# Build with local name
npm i
docker build -t jpinsolle/activity-enrichment .

# Tag image
docker tag jpinsolle/activity-enrichment:latest 010154155802.dkr.ecr.eu-west-1.amazonaws.com/jpinsolle/activity-enrichment:latest

# Push image to ECR
docker push 010154155802.dkr.ecr.eu-west-1.amazonaws.com/jpinsolle/activity-enrichment:latest
````