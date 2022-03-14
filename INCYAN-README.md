
### one off (mac)
brew install clojure/tools/clojure
yarn install
./bin/build-drivers.sh
clojure -P -X:dev:ci:drivers:drivers-dev

### run tests
yarn test-unit
yarn test-timezones
yarn ci-backend

### if you want to run the front end tests
yarn dev (different tab)
yarn test-cypress

### build (in project root)
docker build --tag=branch-test --build-arg MB_EDITION=ee .

