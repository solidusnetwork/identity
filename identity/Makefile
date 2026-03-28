.PHONY: bootstrap migrate dev test

## Run once to set up database and generate .env values
bootstrap:
	cd apps/backend && pnpm exec tsx scripts/bootstrap.ts

## Re-run migrations (requires .env)
migrate:
	cd apps/backend && pnpm exec tsx src/db/migrate.ts

## Start the API server in watch mode (requires .env)
dev:
	cd apps/backend && pnpm dev

## Run tests
test:
	cd apps/backend && pnpm test
