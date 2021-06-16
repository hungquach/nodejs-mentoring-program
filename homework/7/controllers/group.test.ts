import { Request, Response, NextFunction } from 'express';
import { GroupController } from '.';
import { GroupService } from '../services'

jest.mock('../services', () => {
  return {
    GroupService: jest.fn().mockImplementation(() => {
      return {
        getGroups: async () => {
          return [
            {
              "id": "916bc85f-2bb1-4593-9b35-64d49b1d06df",
              "name": "group 1",
              "permissions": [
                "READ"
              ],
              "users": [
                "apple"
              ],
              "userIds": [
                "44251487-7072-4370-b516-6f3f5c571a1d"
              ]
            }
          ];
        }
      };
    }),
  };
});

const mockGroupService = GroupService as jest.Mock<GroupService>;

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  mockGroupService.mockClear();
});

test('should get all groups', async () => {
  // Arrange
  const controller = new GroupController();
  const mockRequest: any = {} as Request;
  const mockResponse: any = {
    json: jest.fn(resObj => resObj),
    status: jest.fn(),
  };
  const mockNext: NextFunction = jest.fn();

  // Act
  const actualResponse = await controller.getGroups(mockRequest, mockResponse, mockNext);

  // Assert
  expect(GroupService).toHaveBeenCalledTimes(1);
  expect(mockNext).toHaveBeenCalledTimes(0);
  expect(actualResponse).toHaveLength(1);
});

describe('when getting all groups', () => {
  beforeAll(() => {
    (mockGroupService as jest.MockInstance<any, any>).mockImplementation(() => {
      return {
        getGroups: () => {
          throw new Error('Test error');
        },
      };
    });
  });

  test('should call next function', async () => {
    // Arrange
    const controller = new GroupController();
    const mockRequest: any = {} as Request;
    const mockResponse: any = {
      json: jest.fn(resObj => resObj),
      status: jest.fn(),
    };
    const mockNext: NextFunction = jest.fn();
    debugger;
    // Act
    const actualResponse = await controller.getGroups(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});