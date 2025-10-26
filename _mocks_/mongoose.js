// __mocks__/mongoose.js
module.exports = {
  Schema: class {},
  model: () => ({}),
  models: {},
  connect: jest.fn(() => Promise.resolve()),
  connection: { readyState: 1 },
  Types: { ObjectId: jest.fn() },
  default: {},
};
