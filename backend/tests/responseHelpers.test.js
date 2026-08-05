const { successResponse, errorResponse } = require('../helpers/responseHelpers');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('responseHelpers', () => {
  test('successResponse returns standard success JSON', () => {
    const res = createMockRes();
    const data = { foo: 'bar' };

    successResponse(res, data, 'Test success', 201);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Test success',
      data,
    });
  });

  test('errorResponse returns standard error JSON', () => {
    const res = createMockRes();

    errorResponse(res, 'Test error', 400, [{ field: 'email', message: 'Invalid' }]);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Test error',
      errors: [{ field: 'email', message: 'Invalid' }],
    });
  });
});
