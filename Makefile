include localconfig
SRC_DIR = 'src/'
DEMO_DIR = 'demo/'
all:
	mkdir -p $(DEMO_DIR)
	sed 's/GM_JS_API_KEY/$(GM_JS_API_KEY)/g' $(SRC_DIR)/index.html > $(DEMO_DIR)/index.html
	sed 's/GM_JS_API_KEY/$(GM_JS_API_KEY)/g' $(SRC_DIR)/wards.html > $(DEMO_DIR)/wards.html
	cp $(SRC_DIR)/*.js $(DEMO_DIR)
