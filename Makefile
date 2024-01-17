install:
	npm ci
start-backend:
	npx start-server --port 3001
start-frontend:
	make -C frontend start
start:
	make start-backend & make start-frontend