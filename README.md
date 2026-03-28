# Zbudowanie i uruchomienie aplikacji:

## Otworzenie projektów gateway_flux_ms i mainpage_ms i uruchomienie w każym z nich:

mvn clean install -DskipTests

### potem odpowiednio w każdym z nich:

docker build -t gateway_ms:latest .

docker build -t mainpage_ms:latest .

### w katalogu docker-compose dodać katalogi (uważać na uprawnienia):

loki-data

loki-temp

loki-war

loki-val

## potem uruchomienie w katalogu docker-compose:

docker compose up -d

### poczekać chwilę, aż się zgłosi, i zalogować się admin/admin w:

http://localhost:8081

### dodanie test_realm, test_client

w realm settings ustawić user registration na on

test_client ma mieć authentication off, standard flow, direct access grants,

root url: http://localhost:3000

home url: /

### valid redirect uris i valid post logout uris:

http://localhost:3000/*

http://localhost:5173/*

### web origins:

http://localhost:3000

http://localhost:5173

## w aplikacji frontend_react_mui uruchomić:

npm run dev

### wejść na stronę:

http://localhost:5173


cd build
npx vite
