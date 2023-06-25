test('validates input fields', () => {
    // Render the Auth component
    const { getByPlaceholderText, getByText } = render(<Auth />);

    // Get the input fields by their placeholder text
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');

    // Enter invalid values in the input fields
    fireEvent.change(usernameInput, { target: { value: 'a' } });
    fireEvent.change(passwordInput, { target: { value: '1234' } });

    // Get the error messages
    const usernameError = getByText('Username must be between 2 and 20 characters long.');
    const passwordError = getByText('Password must be at least 5 characters long.');

    // Assert that the error messages are displayed
    expect(usernameError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();

    // Enter valid values in the input fields
    fireEvent.change(usernameInput, { target: { value: 'validusername' } });
    fireEvent.change(passwordInput, { target: { value: 'validpassword' } });

    // Assert that the error messages are not displayed
    expect(usernameError).not.toBeInTheDocument();
    expect(passwordError).not.toBeInTheDocument();
});
