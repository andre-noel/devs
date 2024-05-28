const request = require('supertest');
const app = require('../app');

describe ('Teste geral', () => {
    // testar listagem de niveis
    it('GET /api/niveis', async () => {
        request(app)
            .get('/api/niveis')
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
            });
    });
});