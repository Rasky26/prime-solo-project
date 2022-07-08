// Import core functions and libraries
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

// Import used components
import { InputField, InputFieldHiddenValues } from '../FormikUtils/Components'

function RegisterForm() {

  // Initialize the dispatch function
  const dispatch = useDispatch()
  // Get errors from the REDUX store
  const errors = useSelector((store) => store.errors)

  // Set the initial values for the form
  const initialValues = {
    email: '',
    password: '',
    passwordCheck: '',
  }

  // Set validation schemes for each variable
  const validationSchema = {
    email: Yup.string()
      .email("Not a valid email")
      .max(254, "Unacceptable email length.\n\tValid email addresses must be 254 characters long or less.")
      .required("Email address is required"),
    password: Yup.string()
      .min(8, "Password is too short")
      .matches(/[A-Z]/, "Password must have at least one (1) capital letter")
      .matches(/\d/, "Password must have at least one (1) number")
      .matches(/[~`! @#$%^&*()_\-+={[}\]|\\:;\"'<,>.?\/"]/, "Password must contain at least one (1) symbols")
      .max(1000, "This password is too long...\n\tLike seriously, how do you ever expect to remember a password of 1000 characters?")
      .required("Password is required"),
    passwordCheck: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password")], "Passwords do not match"),
  }

  // Function that tracks the strength of the password
  const passwordStrength = (passwordString) => {
    console.log(passwordString, ">>> Come back to this later")
  }

  // Attempt to register the current user
  const tryRegisterUser = (values) => {
    dispatch({
      type: 'REGISTER',
      payload: {
        // Uses the KEY of `username`, as the system
        // utilizes that field in a node_modules library.
        username: values.email,
        password: values.passwordCheck,
      }
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
              tryRegisterUser(values)
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
          <InputFieldHiddenValues
            label="Re-Type Password"
            name="passwordCheck"
          />
          <button type="submit" disabled={formik.isSubmitting}>Register</button>
        </Form>
      )}
    </Formik>
  )
}

export default RegisterForm;
