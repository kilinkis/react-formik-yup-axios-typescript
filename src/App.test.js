import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BasicForm from './index';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MutationObserver from 'mutation-observer'
global.MutationObserver = MutationObserver

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BasicForm />, div);
});

it('should show validation on blur', async () => {
  const { getByLabelText, getByTestId } = render(<BasicForm />);
  const input = getByLabelText("Email");
  fireEvent.blur(input);
  await waitFor(() => {
    expect(getByTestId("errors-email")).not.toBe(null);
    expect(getByTestId("errors-email")).toHaveTextContent("Required");
  });
});

it('has email field present', () => {
  const { getByLabelText } = render(<BasicForm />);
  const input = getByLabelText("Email");
  expect(input).toBeInTheDocument();
  expect(input).toBeTruthy();
});

it('accepts company email only', async () => {
  const { container, getByLabelText, findByTestId } = render(<BasicForm />);
  const input = getByLabelText("Email");

  fireEvent.change(input, {
    target: { name: "email", value: "kilinkis@gmail.com" }
  });
  expect(input.value).toBe("kilinkis@gmail.com");
  
  fireEvent.blur(input);
  const validationErrors = await findByTestId(`errors-email`);
  expect(validationErrors.innerHTML).toBe("Must be company email");

});

it('accepts company email', async () => {
  const { container, getByLabelText, findByTestId, queryByTestId } = render(<BasicForm />);
  const input = getByLabelText("Email");

  fireEvent.change(input, {
    target: { name: "email", value: "kilinkis@airtame.com" }
  }); 
  fireEvent.blur(input);
  expect(await waitFor(() => queryByTestId('errors-email'))).toBeFalsy()

});

it("should show validation on blur", async () => {
  const { getByLabelText, getByTestId } = render(<BasicForm />);

  const input = getByLabelText("Email");
  fireEvent.blur(input);

  await waitFor(() => {
    expect(getByTestId("errors-email")).not.toBe(null);
    expect(getByTestId("errors-email")).toHaveTextContent("Required");
  });
});

it.skip('shows State when selecting US', async () => {
  const { container } = render(<BasicForm />);
  const country = container.querySelector('select[name="country"]')
  const state = container.querySelector('select[name="state"]').closest("div")

  expect(country).toBeInTheDocument();
  expect(country).toBeTruthy();
  expect(state).toHaveClass('hidden')

  await waitFor(() => {
    fireEvent.change(country, { // https://stackoverflow.com/questions/61036156/react-typescript-testing-typeerror-mutationobserver-is-not-a-constructor
      target: {
        value: "United States"
      }
    })
  })

  expect(state).not.toHaveClass('hidden');

});


// blame typescript for this implementation
jest.mock('react-datepicker', 
    () => require.requireActual('./__mocks__/DatePickerMock').default());


test.skip("should remove date error if we select date", async () => {
  const { getByText, getByTestId, queryByTestId } = render(<BasicForm />);

  const button = getByText("Submit");
  fireEvent.click(button);

    await waitFor(() => {
    expect(getByTestId("errors-datepickerField")).toHaveTextContent("Required");
  });

  const mockedDateField = getByTestId("mockedDateField");
  fireEvent.change(mockedDateField, { target: { value: new Date() } });

  await waitFor(() => {
    expect(queryByTestId("errors-datepickerField")).toBe(null);
  });
});
