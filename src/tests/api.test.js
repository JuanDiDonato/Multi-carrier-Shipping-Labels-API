const supertest = require('supertest')
const server = require('../server')
const cookieParser = require('cookie-parser');

server.app.use(cookieParser());
const request = supertest.agent(server.app)

// endpoint register
describe('POST /register', () => {

    it('Responde con estado 400 cuando no recibe datos', (done => {
        request
            .post('/clients/register')
            .set('Accept', 'application/json')
            .expect({ error: true, message: 'Complete todos los campos.' })
            .expect(400)
            .end(err => {
                if (err) return done(err);
                done();
            });
    })),

        it('Responde con estado 400 cuando el nombre de usuario ya esta registrado', (done => {
            request
                .post('/clients/register')
                .set('Accept', 'application/json')
                .send({ username: 'test', password: 'test123' })
                .expect({ error: true, message: 'Este usuario ya existe.' })
                .expect(400)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        })),

        it('Responde con estado 201 cuando pasa todas las verificaciones y registra al usuario', (done => {
            request
                .post('/clients/register')
                .set('Accept', 'application/json')
                .send({ username: 'juan2', password: '123' })
                .expect({ error: false, message: 'Usuario creado con exito' })
                .expect(201)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        }))
});

// endpoint login
describe('POST /login', () => {

    it('Responde con estado 400 cuando no recibe datos', (done => {
        request
            .post('/clients/login')
            .set('Accept', 'application/json')
            .expect('Bad Request')
            .expect(400)
            .end(err => {
                if (err) return done(err);
                done();
            });
    })),

        it('Responde con estado 401 cuando recibe datos incorrectos', (done => {
            request
                .post('/clients/login')
                .set('Accept', 'application/json')
                .send({ username: 'test', password: '1234' })
                .expect('Unauthorized')
                .expect(401)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        })),

        it('Responde con estado 200 cuando recibe datos correctos', (done => {
            request
                .post('/clients/login')
                .set('Accept', 'application/json')
                .send({ username: 'test', password: 'test123' })
                .expect((res) => { res.body })
                .expect(200)
                .expect((res) => { 'access_token', res.headers['access_token'] })
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        }))
});

// endpoint labels
describe('POST /', () => {

    it('Responde con estado 400 cuando no recibe datos de envio o de carrier', (done => {
        request
            .post('/labels')
            .set('Accept', 'application/json')
            .send({ carrier: 'fake_carrier' })
            .expect({ error: true, message: 'Ocurrio un error.' })
            .expect(400)
            .end(err => {
                if (err) return done(err);
                done();
            });
    }))

    it('Responde con un estado 400 cuando los datos recibidos son insuficientes, o no funcionan en la api carrier', done => {
        request
            .post('/labels')
            .set('Accept', 'application/json')
            .send([{ carrier: 'fake_carrier', shipment: {} }])
            .expect({ error: true, message: 'Complete todos los campos.' })
            .expect(400)
            .end(err => {
                if (err) return done(err);
                done();
            });
    })

    it('Responde con un estado 200 y un id cuando la solicitud de generacion es exitosa', done => {
        request
            .post('/labels')
            .set('Accept', 'application/json')
            .send([{
                carrier: 'fake_carrier',
                "shipment": {
                  "address_from": {
                    "name": "Fernando López",
                    "street1": "Av. Principal #123",
                    "city": "Azcapotzalco",
                    "province": "Ciudad de México",
                    "postal_code": "02900",
                    "country_code": "MX"
                  },
                  "address_to": {
                    "name": "Isabel Arredondo",
                    "street1": "Av. Las Torres #123",
                    "city": "Puebla",
                    "province": "Puebla",
                    "postal_code": "72450",
                    "country_code": "MX"
                  },
                  "parcels": [
                    {
                      "length": 40,
                      "width": 40,
                      "height": 40,
                      "dimensions_unit": "CM",
                      "weight": 5,
                      "weight_unit": "KG"
                    }
                  ]
                }
              }])
            .expect((res) => { res.body.id, res.body.error, res.body.message })
            .expect(200)
            .end(err => {
                if (err) return done(err);
                done();
            });

    })
});

// endpoint status
describe('POST /check', () => {

    it('Responde con estado 404 cuando no se envia ningun id', (done => {
        request
            .post('/labels/check')
            .set('Accept', 'application/json')
            .expect({ error: true, message: 'Ocurrio un error inesperado.' })
            .expect(404)
            .end(err => {
                if (err) return done(err);
                done();
            });
    }))

    it('Responde con estado 404 cuando el id no existe', (done => {
        request
            .post('/labels/check')
            .set('Accept', 'application/json')
            .send({_id: 'fakeid123'})
            .expect({ error: true, message: 'Ocurrio un error inesperado.' })
            .expect(404)
            .end(err => {
                if (err) return done(err);
                done();
            });
    }))

    it('Responde con estado 200 y el estado si los datos son correctos', (done => {
        request
            .post('/labels/check')
            .set('Accept', 'application/json')
            .send({_id: '6224da76c41954e5d4093041'})
            .expect(res => {res.body})
            .expect(200)
            .end(err => {
                if (err) return done(err);
                done();
            });
    }))

})