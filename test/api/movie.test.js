const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');

chai.use(chaiHttp);

let token,movie_id;

describe('Node Server',() => {

    /**
     * Testler çalışmadan önce çalışır.
     */
    before((done)=> {
            
            chai.request(server)
                .post('/authenticate')
                .send({
                    name:'metinagaoglu1',
                    password:'212121'
                })
                .end((err,res) => {
                    if(!err) {
                        token = res.body.token;
                        console.log(token);
                        done();
                    } else {
                        console.log('Token Exception!');
                    }
                });
    });
    describe('/GET movie',() => {
        it('(/api/movies tests)',(done) => {
            chai.request(server)
                .get('/api/movies')
                .set('x-access-token',token)
                .end((err,res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.status.should.equal(true);
                    res.body.should.have.property('contents');
                    done();
                });
        });

        it('(/api/movies tests)',(done) => {
            chai.request(server)
                .get('/api/movies')
                .end((err,res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('message');
                    done();
                });
        });
    });

    describe('/POST movie', () => {
        it('it should POST a movie', (done) => {
            const movie = {
                title: 'test',
                director_id: '5b2e6510edb32304082bc910',
                category: 'Test',
                country: 'Turkey',
                year:1999,
                imdb_score: 8
            }

            chai.request(server)
                .post('/api/movies')
                .send(movie)
                .set('x-access-token',token)
                .end((err,res) => {
                    res.should.have.status(200);
                    res.body.should.have.be.a('object')
                    res.body.should.have.property('status');
                    res.body.status.should.equal(1);
                    res.body.data.should.have.property('_id');
                    res.body.data.should.have.property('title');
                    res.body.data.should.have.property('director_id');
                    res.body.data.should.have.property('category');
                    res.body.data.should.have.property('country');
                    movie_id = res.body.data._id;
                    done();
                });

        });
    });

    describe('/GET/:movie_id movie', () => {
        it('it should POST a movie', (done) => {
            chai.request(server)
                .get('/api/movies/'+movie_id)
                .set('x-access-token',token)
                .end((err,res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property("_id").eql(movie_id);
                    done();
                });
            });
    });

});