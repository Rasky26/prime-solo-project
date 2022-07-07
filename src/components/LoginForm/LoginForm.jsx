// Import core functions / libraries
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

// Import used components
import { InputField, InputFieldHiddenValues } from '../FormikUtils/Components'


function LoginForm() {
  
  // Initialize the dispatch function
  const dispatch = useDispatch();

  // Set the initial values for the form
  const initialValues = {
    email: '',
    password: '',
  }

  // Set validation schemes for each variable
  const validationSchema = {
    email: Yup.string()
      .email('Not a valid email')
      // .max(254, "Unacceptable email length.\n\tValid email addresses must be 254 characters long or less.")
      .required('Email address is required'),
    password: Yup.string()
      // .min(8, 'Password is too short')
      // .max(1000, "This password is too long...\n\tLike seriously, how do you ever expect to remember a password of 1000 characters?")
      .required('Password is required'),
  }

  // Function that dispatches the login of a user
  const tryLoginUser = (values) => {

    dispatch({
      type: 'LOGIN',
      payload: {
        // The email field MUST still pass the key
        // `username` in order to work with the
        // node_module `passport_local` library!!!
        username: values.email,
        password: values.password,
      },
    })
  }

  // Build the form to the DOM
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object(validationSchema)}
      onSubmit={(values, actions) => {
          setTimeout(() => {
              // Attempt to log the user in
              tryLoginUser(values)
              // Use this field to diable the login button
              actions.setSubmitting(false)
              actions.resetForm()
          }, 400);
      }}
    >
      {formik => (
        <Form>
          <InputField
            label="Email Address"
            name="email"
            type="text"
          />
          <InputFieldHiddenValues
            label="Password"
            name="password"
          />
          <button type="submit" disabled={formik.isSubmitting}>Login</button>
        </Form>
      )}
    </Formik>
  )
}

export default LoginForm;
