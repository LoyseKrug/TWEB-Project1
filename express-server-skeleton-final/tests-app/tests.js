// test/sample-test.js
const assert = require('assert');
describe('String', function () {
    it('should replace some characters', function () {
        const name = 'paulnta'
            .replace('au', 'o')
            .replace('n', 'en');
        assert.equal(name, 'polenta');
    });
    it('will fail', function () {
        assert.equal('1' + '1', '2');
        // AssertionError [ERR_ASSERTION]: '11' == '2'
    });
});