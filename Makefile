DIST_DIR=dist
VERSION=1.1.0

.PHONY: env
env:
	npm install && cd src && npm install

.PHONY: build
build:
	./node_modules/.bin/electron-builder --linux --ia32 --x64

.PHONY: run
run:
	cd src && npm run start

.PHONY: clean
clean:
	rm -rf $(DIST_DIR)


.PHONY: archive
archive:
	zip -r $(DIST_DIR)/todoist-linux.zip $(DIST_DIR)/linux-unpacked/*

.PHONY: set-version
set-version:
	cd src && npm version $(VERSION)

.PHONY: list
list:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'