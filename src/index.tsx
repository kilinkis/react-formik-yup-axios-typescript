import * as React from 'react';
import { render } from 'react-dom';
import {
  Formik,
  Field,
  Form,
  FormikProps,
  FormikHelpers as FormikActions,
} from 'formik';
import { DisplayFormikState } from './helper';
// import axios from 'axios';
import * as Yup from 'yup';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import DatePicker from 'react-datepicker';
import './skeleton.css';
import './main.css';
import 'react-datepicker/dist/react-datepicker.css';

interface Values {
  website: string;
  firstName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  dropdownField: string;
  datepickerField: string;
  conditionalFieldReveal: string;
  conditionalField: string;
}

const phoneRegExp = /^[+\d]+(?:[\d-.\s()]*)$/;
const companyEmailRegExp = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(?!gmail|googlemail|msn|aol|yahoo|live|inbox)(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i;

const BasicForm: React.SFC<{}> = () => (
  <div className="container">
    <Formik
      initialValues={{
        website: '',
        firstName: '',
        email: '',
        phone: '',
        country: '',
        state: '',
        dropdownField: '',
        datepickerField: '',
        conditionalFieldReveal: '',
        conditionalField: '',
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().required('Required field'),
        website: Yup.string().url('Must be a valid URL'),
        email: Yup.string()
          .matches(companyEmailRegExp, 'Must be company email')
          .required('Required'),
        phone: Yup.string()
          .matches(phoneRegExp, 'Phone number is not valid')
          .required('Required field'),
        country: Yup.string().required('Required field'),
        state: Yup.string().when('country', {
          is: (val) => val === 'United States', // alternatively: (val) => val == true
          then: Yup.string().required('Field is required'),
          otherwise: Yup.string(),
        }),
        // datepickerField: Yup.string().required('Required'),
        conditionalFieldReveal: Yup.string().required('Required field'),
        conditionalField: Yup.string().when('conditionalFieldReveal', {
          is: (val) => val === 'other', // alternatively: (val) => val == true
          then: Yup.string().required('Field is required'),
          otherwise: Yup.string(),
        }),
      })}
      initialStatus={{
        // resetForm(); also resets this initialStatus
        sent: 'nope',
        industry: '',
      }}
      onSubmit={(
        values: Values,
        { setStatus, setSubmitting, resetForm }: FormikActions<Values>
      ) => {
        console.log(values);
        setSubmitting(false); // this line should be in the commented success of the axios call
        setStatus('sent'); // this line should be in the commented success of the axios call
        // axios({
        //   method: 'post',
        //   url: 'https://getform.io/f/wour-form-f',
        //   data: { email: values.email, values },
        // }).then((r) => {
        //   setSubmitting(false);
        //   // resetForm();
        //   setStatus('sent');
        //   console.log('Thanks!');
        // });
      }}
    >
      {(
        {
          status,
          setStatus,
          errors,
          touched,
          isSubmitting,
          dirty,
          handleChange,
          handleBlur,
          values,
          setFieldValue,
        }: FormikProps<Values>
      ) => (
        <Form>
          <div className={status}>
            <h4>Formik x TypeScript</h4>

            <fieldset>
              <legend>Your Information</legend>

              <label htmlFor="firstName">First Name</label>
              <Field
                id="firstName"
                name="firstName"
                placeholder="John"
                type="text"
                className={
                  errors.firstName && touched.firstName
                    ? 'text-input error'
                    : 'text-input'
                }
              />
              {errors.firstName && touched.firstName && (
                <div className="input-feedback">{errors.firstName}</div>
              )}

              <label htmlFor="email">Email</label>
              <Field
                id="email"
                name="email"
                placeholder="john@acme.com"
                type="email"
                className={
                  errors.email && touched.email
                    ? 'text-input error'
                    : 'text-input'
                }
              />
              {errors.email && touched.email && (
                <div className="input-feedback" data-testid={`errors-email`}>{errors.email}</div>
              )}

              <label htmlFor="phone">Phone number</label>
              <Field
                id="phone"
                name="phone"
                placeholder="with area code"
                type="text"
                className={
                  errors.phone && touched.phone
                    ? 'text-input error'
                    : 'text-input'
                }
              />
              {errors.phone && touched.phone && (
                <div className="input-feedback">{errors.phone}</div>
              )}

              <label htmlFor="website">Your Website</label>
              <Field
                id="website"
                name="website"
                type="text"
                placeholder="https://example.com"
                className={
                  errors.website && touched.website
                    ? 'text-input error'
                    : 'text-input'
                }
              />
              {errors.website && touched.website && (
                <div className="input-feedback">{errors.website}</div>
              )}
            </fieldset>

            <fieldset>
              <legend>Some more Information</legend>

              <CountryDropdown
                name="country"
                value={values.country}
                onChange={(
                  _: string,
                  e: React.ChangeEvent<HTMLInputElement>
                ) => {
                  handleChange(e);
                  setStatus({
                    ...status,
                    country: e.currentTarget.value,
                  });
                }}
                onBlur={handleBlur}
              />
              {errors.country && touched.country && (
                <div className="input-feedback">{errors.country}</div>
              )}

              <div
                className={
                  errors.state && touched.state
                    ? 'text-input error'
                    : 'text-input' && status.country === 'United States'
                    ? ''
                    : 'hidden'
                }
              >
                <RegionDropdown
                  name="state"
                  country={values.country}
                  value={values.state}
                  onChange={(_, e) => handleChange(e)}
                />
                {errors.state && touched.state && (
                  <div className="input-feedback">{errors.state}</div>
                )}
              </div>

              <label htmlFor="conditionalFieldReveal">
                Conditional Dropdown field
              </label>
              <Field
                as="select"
                name="conditionalFieldReveal"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                  setStatus({
                    ...status,
                    industry: e.currentTarget.value,
                  });
                }}
              >
                <option hidden={true}>Select an Option</option>
                <option value="other">Select me to reveal hidden field</option>
              </Field>
              {errors.conditionalFieldReveal &&
                touched.conditionalFieldReveal && (
                  <div className="input-feedback">
                    {errors.conditionalFieldReveal}
                  </div>
                )}
              <Field
                id="conditionalField"
                name="conditionalField"
                placeholder="I was hidden!"
                type="text"
                className={
                  errors.conditionalField && touched.conditionalField
                    ? 'text-input error'
                    : 'text-input' && status.industry === 'other'
                    ? ''
                    : 'hidden'
                }
              />
              {errors.conditionalField && touched.conditionalField && (
                <div className="input-feedback">{errors.conditionalField}</div>
              )}

              <label htmlFor="datepickerField">Date picker</label>
              <DatePicker
                name="datepickerField"
                selected={
                  values.datepickerField
                    ? new Date(values.datepickerField)
                    : null
                }
                onChange={(val) => setFieldValue('datepickerField', val)}
              />
              {errors.datepickerField && touched.datepickerField && (
                <div className="input-feedback" data-testid={`errors-datepickerField`}>{errors.datepickerField}</div>
              )}
            </fieldset>

            <button
              type="submit"
              disabled={!dirty || isSubmitting}
              className=""
            >
              Submit {isSubmitting && <span>Sending...</span>}
            </button>
            <DisplayFormikState {...values} />
          </div>
          {console.log(status)}
          {console.log(errors)}
          {status === 'sent' && <h4 className="success">Thanks!</h4>}
        </Form>
      )}
    </Formik>
  </div>
);

render(<BasicForm />, document.getElementById('root'));
// export default BasicForm;