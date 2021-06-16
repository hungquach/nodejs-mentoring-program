import { Request, Response, NextFunction } from 'express';
import { UserController } from '.';
import { UserService } from '../services'

jest.mock('../services', () => {
  return {
    UserService: jest.fn().mockImplementation(() => {
      return {
        getUsers: async () => {
          return [
            {
                "id": "5d0c1302-5aab-4c34-bd88-df339cac177c",
                "login": "apple",
                "password": "P@ssword123",
                "age": 29,
                "isDeleted": false,
                "groups": [
                    "group 1",
                    "group 2",
                    "group 3"
                ],
                "groupIds": [
                    "fcf680db-0422-4a2d-9022-baa5d02a1737",
                    "02cd6eef-d3ef-4d88-8389-49701399be68",
                    "5e4e8c6f-951f-418b-9a3a-e2848060b86d"
                ]
            }
          ]
        }
      };
    }),
  };
});

const mockUserService = UserService as jest.Mock<UserService>;

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  mockUserService.mockClear();
});

test('should get all users', async () => {
  // Arrange
  const controller = new UserController();
  const mockRequest: any = {} as Request;
  const mockResponse: any = {
    json: jest.fn(resObj => resObj),
    status: jest.fn(),
  };
  const mockNext: NextFunction = jest.fn();

  // Act
  const actualResponse = await controller.getUsers(mockRequest, mockResponse, mockNext);

  // Assert
  expect(UserService).toHaveBeenCalledTimes(1);
  //expect(mockNext).toHaveBeenCalledTimes(0);
  //expect(actualResponse).toHaveLength(1);
});

// describe('when getting all users', () => {
//   beforeAll(() => {
//     (mockUserService as jest.MockInstance<any, any>).mockImplementation(() => {
//       return {
//         getUsers: () => {
//           throw new Error('Test error');
//         },
//       };
//     });
//   });

//   test('should call next function', async () => {
//     // Arrange
//     const controller = new UserController();
//     const mockRequest: any = {} as Request;
//     const mockResponse: any = {
//       json: jest.fn(resObj => resObj),
//       status: jest.fn(),
//     };
//     const mockNext: NextFunction = jest.fn();
//     debugger;
//     // Act
//     const actualResponse = await controller.getUsers(mockRequest, mockResponse, mockNext);

//     // Assert
//     expect(mockNext).toHaveBeenCalledTimes(1);
//   });
// });