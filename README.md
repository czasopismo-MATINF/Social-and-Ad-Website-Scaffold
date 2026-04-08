# Zbudowanie i uruchomienie aplikacji:
# Building and Running the Application:
(mind that almost all commits', prs' comments and UI are in Polish)

## Otworzenie projektów gateway_flux_ms i mainpage_ms i ad_ms i uruchomienie w każym z nich:
## Open projects gateway_flux_mx and mainpage_ms and ad_ms and run in each of them:

mvn clean install -DskipTests

### potem odpowiednio w każdym z nich:
### then accordingly in each of them:

docker build -t gateway_ms:latest .

docker build -t mainpage_ms:latest .

docker build -t ad_ms:latest .

### w katalogu docker-compose dodać katalogi (uważać na uprawnienia):
### in the docker-compose directory add directories (be careful with permissions):

loki-data

loki-temp

loki-war

loki-val

## potem uruchomienie w katalogu docker-compose:
## then run in the directory docker-compose:

docker compose up -d

### poczekać chwilę, aż się zgłosi, i zalogować się admin/admin w:
### wait a moment until it responds, and log in with admin/admin at:

http://localhost:8081

### dodanie test_realm, test_client:
### adding test_realm, test_client:

w realm settings ustawić user registration na on
(in realm settings set user registration to on)

test_client ma mieć authentication off, standard flow, direct access grants,
(test_client should have authentication off, standard flow, direct access grants,)

root url: http://localhost:3000

home url: /

### valid redirect uris i valid post logout uris:
### valid redirect uris and valid post logout uris:

http://localhost:3000/*

http://localhost:5173/*

### web origins:

http://localhost:3000

http://localhost:5173

## w aplikacji frontend_react_mui uruchomić:
## in the frontend_react_mui application run:

npm install

### potem:
### then:

npm run dev

### lub:
### or:

npm run build

cd dist

npx vite

### wejść na stronę:
### go to the website:

http://localhost:5173

(Hasła i użytkownicy do pgadmina(pgadmin@example.com,pgadminpassword), adminera(pguser,pgpassword), grafany(admin,admin), kafki ui, keycloaka(admin,admin) admina odczytać z pliku docker-compose.yml i tam sprawdzić.)

(Passwords and users for pgAdmin (pgadmin@example.com, pgadminpassword), Adminer (pguser, pgpassword), Grafana (admin, admin), Kafka UI, Keycloak (admin, admin) should be read from the docker-compose.yml file and checked there.)

Szkielet aplikacji był rozwijany na Windows 11 z Docker Desktop i Node. (The application skeleton was developed on Windows 11 with Docker Desktop and Node.)
