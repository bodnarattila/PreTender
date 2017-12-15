mongoimport --drop -d pretender -c users ./pretenderDB_setup_users.json
mongoimport --drop -d pretender -c tenderTypes ./pretenderDB_setup_tendertypes.json
mongoimport --drop -d pretender -c issuedTenders ./pretenderDB_setup_issuedTenders.json
mongoimport --drop -d pretender -c applications ./pretenderDB_setup_applications.json
