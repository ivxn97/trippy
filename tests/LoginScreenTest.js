import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

describe('onLoginPress', () => {
  let signInWithEmailAndPasswordSpy;
  let getDocSpy;
  let setStatusSpy;
  let setUserNameSpy;
  let setRoleSpy;
  let setBusinessesSpy;

  beforeEach(() => {
    signInWithEmailAndPasswordSpy = jest.spyOn(firebase.auth(), 'signInWithEmailAndPassword')
      .mockImplementation(() => Promise.resolve({
        user: { email: 'test@test.com' }
      }));
    getDocSpy = jest.spyOn(firebase.firestore(), 'getDoc')
      .mockImplementation(() => Promise.resolve({
        exists: true,
        data: () => ({
          role: 'test role',
          businessesTypes: 'test businesses',
          firstName: 'Test',
          lastName: 'User',
          status: 'test status'
        })
      }));
    setStatusSpy = jest.fn();
    setUserNameSpy = jest.fn();
    setRoleSpy = jest.fn();
    setBusinessesSpy = jest.fn();
  });

  afterEach(() => {
    signInWithEmailAndPasswordSpy.mockRestore();
    getDocSpy.mockRestore();
  });

  it('should call signInWithEmailAndPassword and getDoc with correct arguments', async () => {
    const auth = {};
    const email = 'test@test.com';
    const password = 'test password';
    const db = {};
    const doc = (dbRef, collection, document) => ({});

    await onLoginPress({ auth, email, password, db, doc, setStatus: setStatusSpy, setUserName: setUserNameSpy, setRole: setRoleSpy, setBusinesses: setBusinessesSpy });

    expect(signInWithEmailAndPasswordSpy).toHaveBeenCalledWith(auth, email, password);
    expect(getDocSpy).toHaveBeenCalledWith({});
  });

  it('should set correct state values when user exists', async () => {
    const auth = {};
    const email = 'test@test.com';
    const password = 'test password';
    const db = {};
    const doc = (dbRef, collection, document) => ({});

    await onLoginPress({ auth, email, password, db, doc, setStatus: setStatusSpy, setUserName: setUserNameSpy, setRole: setRoleSpy, setBusinesses: setBusinessesSpy });

    expect(setStatusSpy).toHaveBeenCalledWith('test status');
    expect(setUserNameSpy).toHaveBeenCalledWith('Test User');
    expect(setRoleSpy).toHaveBeenCalledWith('test role');
    expect(setBusinessesSpy).toHaveBeenCalledWith('test businesses');
  });

  it('should log error when user does not exist', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const auth = {};
    const email = 'test@test.com';
    const password = 'test password';
    const db = {};
    const doc = (dbRef, collection, document) => ({});

    getDocSpy.mockImplementation(() => Promise.resolve({
        exists: false
      }));
      
      await onLoginPress({ auth, email, password, db, doc, setStatus: setStatusSpy, setUserName: setUserNameSpy, setRole: setRoleSpy, setBusinesses: setBusinessesSpy });
      
      expect(consoleSpy).toHaveBeenCalledWith('Error', undefined);
      consoleSpy.mockRestore();
      
    });

    it('should log error code and error message on catch', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const auth = {};
    const email = 'test@test.com';
    const password = 'test password';
    const db = {};
    const doc = (dbRef, collection, document) => ({});

    signInWithEmailAndPasswordSpy.mockImplementation(() => Promise.reject({
        code: 'test code',
        message: 'test message'
      }));
      
      await onLoginPress({ auth, email, password, db, doc, setStatus: setStatusSpy, setUserName: setUserNameSpy, setRole: setRoleSpy, setBusinesses: setBusinessesSpy });
      
      expect(consoleSpy).toHaveBeenCalledWith('Error Code: ', 'test code', 'Error Message: ', 'test message');
      consoleSpy.mockRestore();
      
    });
});

