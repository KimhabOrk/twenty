postgres-on-docker:
	docker run \
	--name twenty_pg \
	-e PGUSER_SUPERUSER=twenty \
	-e PGPASSWORD_SUPERUSER=twenty \
	-e ALLOW_NOSSL=true \
	-v twenty_db_data:/home/postgres/pgdata \
	-p 5432:5432 \
	twentycrm/twenty-postgres-spilo:latest


redis-on-docker:
	docker run -d --name twenty_redis -p 6379:6379 redis/redis-stack-server:latest