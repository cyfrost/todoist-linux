DIST_DIR=dist
VERSION=1.0.0

.PHONY: run
run:
	cd src && npm start

.PHONY: packages
packages:
	./node_modules/.bin/electron-builder --linux --ia32 --x64

.PHONY: archive
archive:
	zip -r $(DIST_DIR)/todoist-linux.zip $(DIST_DIR)/linux-unpacked/*

.PHONY: set-version
set-version:
	cd src && npm version $(VERSION)
