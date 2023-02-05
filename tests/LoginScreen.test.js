import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen/LoginScreen';

/*
const email = 'ru@ru.com';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn().mockReturnValue({ user: { email } }),
  getAuth: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
setItem: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn().mockReturnValue({ exists: true, data: () => ({ role: 'Registered User' }) }),
}));

jest.mock("../config", () => jest.fn());

jest.mock('react-native-keyboard-aware-scroll-view', () => {
    const KeyboardAwareScrollView = ({ children }) => children;
    return { KeyboardAwareScrollView };
  });

describe('LoginScreen component', () => {
it('should display the login form and call the signInWithEmailAndPassword method when the login button is pressed', async () => {
const email = 'ru@ru.com';
const password = 'test123';
const signInWithEmailAndPasswordMock = require('firebase/auth').signInWithEmailAndPassword;
signInWithEmailAndPasswordMock.mockReturnValue({ user: { email } });
const getDocMock = require('firebase/firestore').getDoc;
getDocMock.mockReturnValue({ exists: true, data: () => ({ role: 'Registered User' }) });
const setItemMock = require('@react-native-async-storage/async-storage').setItem;
const navigation = { navigate: jest.fn() };
const { getByPlaceholderText, getByText } = render(
<LoginScreen navigation={navigation} />
);
const emailInput = getByPlaceholderText('E-mail');
const passwordInput = getByPlaceholderText('Password');
const loginButton = getByText('Log in');
fireEvent.changeText(emailInput, email);
fireEvent.changeText(passwordInput, password);
fireEvent.press(loginButton);

expect(setItemMock).toHaveBeenCalledWith('email', email);
expect(setItemMock).toHaveBeenCalledWith('role', 'Registered User');
expect(navigation.navigate).toHaveBeenCalledWith('Profile Page');
});
});*/

const email = 'ru@ru.com';
const navigation = { navigate: jest.fn() };

jest.mock('@react-native-async-storage/async-storage', () => ({
setItem: jest.fn(),
}));

jest.mock('react-native-keyboard-aware-scroll-view', () => {
    const KeyboardAwareScrollView = ({ children }) => children;
    return { KeyboardAwareScrollView };
  });

describe('Login Form', () => {
  it('should submit the form with correct username and password', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Log in');

    fireEvent.changeText(emailInput, 'ru@ru.com');
    fireEvent.changeText(passwordInput, 'test123');
    fireEvent.press(submitButton);

    const flushPromises = () => new Promise(setImmediate);

    expect(navigation.navigate).toHaveBeenCalledWith('Profile Page');
  });
});