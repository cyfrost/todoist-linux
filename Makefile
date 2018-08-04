DIST_DIR=dist
VERSION=1.0.0

.PHONY: run
run:
	cd src && npm run start

.PHONY: packages
packages:
	./node_modules/.bin/electron-builder --linux --ia32 --x64

.PHONY: build
build:
	npm install && cd src && npm install && npm run start


.PHONY: archive
archive:
	zip -r $(DIST_DIR)/todoist-linux.zip $(DIST_DIR)/linux-unpacked/*

.PHONY: set-version
set-version:
	cd src && npm version $(VERSION)
