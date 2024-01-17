install:
	npm ci
start-backend:
	npx start-server --port 3002 --static ./frontend/build
start-frontend:
	make -C frontend start
start:
	make start-backend & make start-frontend