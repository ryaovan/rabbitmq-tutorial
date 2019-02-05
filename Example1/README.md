# HOW TO RUN: build image then run with rabbitmq

cd <project_root>
docker build --tag=rabbitapp .
docker-compose up -d

# Routing-Engine Role:

1. Consume from existing storeConfig queue
2. Create monitor ex/queue
3. Create/consume order, completedOrders ex/queue
4. publish order to monitor ex
5. publish order to completedOrders ex

# Other Roles in System:

1. Admin Tool: Create storeConfig ex/queue, publish to storeConfig ex
2. POS: create order ex/queue, publish order to order ex
3. KDS: consume storeConfig, monitor msg, publish to order ex
