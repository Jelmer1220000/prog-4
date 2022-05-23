# Nodejs-Samen-Eten-Server

[![Deploy to Heroku](https://github.com/Jelmer1220000/prog-4/actions/workflows/main.yml/badge.svg)](https://github.com/Jelmer1220000/prog-4/actions/workflows/main.yml)

Samen-eten-server is een server voor het aanmelden, aanmaken, verwijderen en wijzigen van maaltijden voor en door andere mensen, Waarmee mensen hun maaltijden kunnen delen met mensen uit de buurt door middel van een Online Server.

----

## Functies

Er zijn meerdere functies gerealiseerd voor dit project om te zorgen dat mensen zich op een gemakkelijke manier kunnen aanmelden als gebruiker of bij een maaltijd.

#### Inloggen

- Inloggen als een bestaande gebruiker.

#### Gebruikers

- Het aanmaken van een nieuwe gebruiker.
- Het ophalen van gebruikers informatie.
- Het wijzigen van je persoonlijke Informatie.
- Het verwijderen van je eigen informatie.

#### Maaltijden

- Het zien van maaltijden aangeboden door andere.
- Het aanmaken van maaltijden.
- Het wijzigen van maaltijden (gemaakt door de persoon).
- Het verwijderen van maaltijden (gemaakt door de persoon).
- Het aanmelden en afmelden bij maaltijden van anderen.

----

## Installeren

##### De server is online beschikbaar op: https://nodejs-prog-4.herokuapp.com/

###### Paths zijn /api/user, /api/meal, /auth/login

Om te gebruiken stuur een request naar deze server passend op de gewenste actie:
GET, POST, PUT of DELETE

---

## Gebruikte Projecten

Voor deze server zijn meerdere Open Source projects gebruikt.

- [node.js](https://nodejs.org/en/) - evented I/O for the backend.
- [Express](https://expressjs.com/) - Network app framework.
- [Mysql2](https://www.npmjs.com/package/mysql2) - Database voor het bijhouden van de gegevens.
- [jsonwebToken](https://www.npmjs.com/package/jsonwebtoken) - Voor het beveiligen van gegevens.
- [dotenv](https://www.npmjs.com/package/dotenv) - Voor het gebruiken van environment variabelen.

Natuurlijk is dit ook een Open source project [Repository](https://github.com/Jelmer1220000/prog-4)

---

## Betrouwbaarheid

Voor het zorgen van een betrouwbare server zonder errors zijn er verschillende test cases opgesteld die zorgen dat de server niet gedeployed kan worden wanneer 1 van deze faalt, dit zorgt voor sustainability en Reliability.

## Veiligheid

Om te zorgen dat er een veilige server opgebouwd wordt, heb ik besloten JsonWebtoken te Implementeren. Hierdoor kan niet iedereen gebruikers wijzigen en verwijderen tenzij ze zich aangemeld hebben.

---

## Endpoints

Er zijn meerdere endpoints gerealiseerd om te zorgen dat mensen aan kunnen roepen waar ze naar zoeken. Dit zorgt voor een gebruiksvriendelijke server.

Base url: https://nodejs-prog-4.herokuapp.com/

### Inloggen

- POST /api/auth/login

### Gebruikers

- GET /api/user
- GET /api/user/{id}
- GET /api/user/profile
- PUT /api/user/{id}
- DELETE /api/user/{id}

### Meals

- GET /api/meal
- GET /api/meal/{id}
- PUT /api/meal/{id}
- DELETE /api/meal/{id}
- GET /api/meal/{id}/participate

---
