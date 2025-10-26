// __mocks__/mongoose.js
module.exports = {
  Schema: class {
    constructor() {}
    static Types = { ObjectId: {} };
  },
  model: () => ({}),
  models: {},
  connect: jest.fn(),
  connection: { readyState: 1 },
  Types: { ObjectId: {} },
  default: {},
};
