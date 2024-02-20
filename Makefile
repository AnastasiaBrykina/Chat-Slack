install:
	npm ci

start-backend:
	npx start-server --port 5000 --static ./frontend/build

start-frontend:
	make -C frontend start

lint-frontend:
	make -C frontend lint
	
start:
	make start-backend & make start-frontend

build:
	rm frontend/build -rf
	npm run build