// Import core functions / libraries
import { useField } from 'formik'
import { useState } from 'react'

// Import localized stylesheet
import styles from "./Components.module.css"


// A standardized `input` component field that utilizes Formik properties
const InputField = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props)

  // Build the DOM input element
  return (
    <div className='input-field'>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  )
}


// A standardized `input` component field that utilizes Formik properties
const InputFieldHiddenValues = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props)

  // Initialize the ability to toggle the state value whether
  // or not the hidden field values are displayed in plain
  // text or as dots
  const [showPlainText, setShowPlainText] = useState(false)

  // Function that allows the user to toggle between
  // seeing their password and hiding it with dots
  const toggleShowPlainText = () => {
    setShowPlainText(!showPlainText)
    console.log('yuppers')
  }

  // Build the DOM input element
  return (
    <div className='input-field'>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input
        className="text-input"
        type={showPlainText ? "text" : "password"}
        {...field} {...props} />
      <button className={styles.display_password} type="button" onClick={toggleShowPlainText}>{showPlainText ? "Hide" : "Show"}</button>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  )
}


// A standardized `checkbox` component field utilizing Formik.
const Checkbox = ({ children, ...props }) => {
  // React treats radios and checkbox inputs differently other input types, select, and textarea.
  // Formik does this too! When you specify `type` to useField(), it will
  // return the correct bag of props for you -- a `checked` prop will be included
  // in `field` alongside `name`, `value`, `onChange`, and `onBlur`
  const [field, meta] = useField({ ...props, type: 'checkbox' })

  // Build the DOM checkbox element
  return (
    <div className='input-field'>
      <label className="checkbox-input">
        <input type="checkbox" {...field} {...props} />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  )
}


// A standardized `select` component utilizing Formik
const Selection = ({ label, ...props }) => {
  const [field, meta] = useField(props)

  // Build the DOM select element
  return (
    <div className='input-field'>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  )
}

export { Checkbox, InputField, InputFieldHiddenValues, Selection}