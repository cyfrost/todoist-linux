DIST_DIR=dist
VERSION=1.1.0

.PHONY: env
env:
	@npm install && cd src && npm install && echo "\nAll development dependencies have been installed successfully!\n"

.PHONY: build
build:
	@./node_modules/.bin/electron-builder --linux && echo "\n\nAll package build targets have been built successfully in $(DIST_DIR) directory!\n"

.PHONY: run
run:
	@cd src && npm run start

.PHONY: clean
clean:
	@rm -rf $(DIST_DIR) && echo "\nBuild artifacts (from './$(DIST_DIR)') have been deleted successfully!\n"


.PHONY: archive
archive:
	@zip -r $(DIST_DIR)/todoist-linux.zip $(DIST_DIR)/linux-unpacked/*

.PHONY: set-version
set-version:
	@cd src && npm version $(VERSION) && echo "\nApp version updated successfully to $(VERSION)!\n"

.PHONY: list
list:
	@echo "\nAvailable Makefile commands:\n" && $(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$' && echo "\n\n"