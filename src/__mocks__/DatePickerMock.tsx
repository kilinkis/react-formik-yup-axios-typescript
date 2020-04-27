/* tslint:disable:no-use-before-declare */
import * as React from 'react';

export interface DatePickerInterface extends DatePicker {
  onChange: Function;
}

export class DatePickerMock<T extends DatePicker> extends React.Component<T, {}> { }

export class DatePicker extends DatePickerMock<DatePickerInterface> {
    render() {
        return `<input
        data-testid="mockedDateField"
        onChange={() => this.props.onChange('asdfasd')}
      />`;
    }
}

export default DatePicker;