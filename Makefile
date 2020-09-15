export PROJECT_ID=cs61a-140900

.PHONY: exam-deploy
exam-deploy:
	cd apps/exam && gcloud functions deploy exam-server --runtime python37 --trigger-http --entry-point index

.PHONY: exam-dev
exam-dev:
	export MODE=exam; \
	export FLASK_APP=run_local; \
	export GOOGLE_APPLICATION_CREDENTIALS=$(shell pwd)/creds.json; \
	export ENV=dev; \
	yarn run concurrently webpack "cd apps && python run_local.py"

.PHONY: admin-deploy
admin-deploy:
	cd apps/admin && gcloud functions deploy exam-admin --runtime python37 --trigger-http --entry-point index --timeout 500

.PHONY: admin-dev
admin-dev:
	export MODE=admin; \
	export FLASK_APP=run_local; \
	export GOOGLE_APPLICATION_CREDENTIALS=$(shell pwd)/creds.json; \
	export ENV=dev; \
	yarn run concurrently webpack "cd apps && flask run"

.PHONY: write-dev
write-dev:
	export MODE=write; \
	export FLASK_APP=run_local; \
	export GOOGLE_APPLICATION_CREDENTIALS=$(shell pwd)/creds.json; \
	export ENV=dev; \
	yarn run concurrently webpack "cd apps && python run_local.py"

.PHONY: write-deploy
write-deploy:
	cd apps/write && \
	gcloud builds submit --tag gcr.io/$(PROJECT_ID)/staff-exam-server && \
	gcloud run deploy --image gcr.io/$(PROJECT_ID)/staff-exam-server --platform managed

.PHONY: alerts-deploy
alerts-deploy:
	cd apps/alerts && gcloud functions deploy exam-alerts --runtime python37 --trigger-http --entry-point index --timeout 500

.PHONY: alerts-dev
alerts-dev:
	export MODE=alerts; \
	export FLASK_APP=run_local; \
	export GOOGLE_APPLICATION_CREDENTIALS=$(shell pwd)/creds.json; \
	export ENV=dev; \
	yarn run concurrently webpack "cd apps && python run_local.py"
