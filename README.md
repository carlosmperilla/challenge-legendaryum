# challenge-legendaryum
## Lo implementado
Resolviendo reto de Legendaryum. Microservicio con WebSockets y API de consulta.
- Crear sistema de socket que permita unir a salas (rooms) a los clientes.
- El sistema responde con las monedas actuales.
- Al recibir un evento del cliente, indicando que este agarro una moneda,  
  los demas clientes deben ser informados que no esta disponible.
  Además se borra esta moneda del cache.
- API-REST para consultas básicas.  
  Las monedas de las habitaciones y las monedas por habitación en este caso.
- Se configura mediante un JSON contenido en la carpeta 'config'.  
  Donde se indican Las Rooms, la cantidad de monedas a generar, y los limites del area 3D,  
  donde se van a generar las monedas.
- Se realiza la persistencia en cache (por tanto con tiempo de expiración, de 1 hora), en Redis.
- Tecnologias: **Express, NodeJs, Typescript, Redis, Socket.io, Docker.**

## Despliegue en local
```
  git clone https://github.com/carlosmperilla/challenge-legendaryum.git
  cd challenge-legendaryum
  docker compose up
```

## Endpoints
- **URL_BASE: http://localhost:3000**
- **/** : Endpoint de prueba.
- **rooms/** : Endpoint con la información de todas las habitaciones.
- **rooms/[room-name]/** : Endpoint con la información de una de las habitaciones.  
  Por ejemplo: **http://localhost:3000/rooms/room1/'**.

## Sockets - Eventos en Postman
Para pruebas en Postman
### Eventos escuchados por el cliente:
- **coins**: datos de las monedas (ID y coordenada), iniciales y actualizadas (al expirar).
- **unAvailableCoin**: moneda no disponible de la sala a la que se ha conectado.

### Eventos escuchados por el servidor.
- **joinRoom**: Acepta dato string (**room1**, **room2**, **room3** por defecto).
- **coinPicked**: Acepta dato string, el ID de la moneda por ejemplo: **31-22-23**.
