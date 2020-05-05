var _ = require('lodash');
var murmur = require('../dist/umd/index');
var expect = require('chai').expect;
var data = require('../testData.json');

describe('murmur', function () {
  describe('murmur3', function () {
    it('should generate expected values', function () {
      _.each(data.murmur3, function (value, key) {
        let nums = [];
        for (let i = 0; i < key.length; i++) {
          nums[i] = key.charCodeAt(i);
        }
        expect(murmur.murmur3(new Uint8Array(nums))).to.equal(value);
      });
    });
  });
});
