rm -rf www/*
grunt coffee:dist
grunt compass:server
cp -R .tmp/* www/
cp -R app/components www/
cp -R app/jsons www/
cp -R app/images www/
cp -R app/views www/
cp -R app/library www/
cp -R app/index.html www/