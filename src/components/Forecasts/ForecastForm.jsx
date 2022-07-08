// Import the core libraries and components
import { Form, Formik } from 'formik'
import * as Yup from 'yup'

// Import the used components
import { InputField, Selection } from '../FormikUtils/Components'

// Component that handles the building and handling of each day's
// forecast forms
function ForecastForm() {

  
  // Set the initial values for the form
  const initialValues = {
    cloud_cover: '',
    pop: '',
    high_temp: '',
    low_temp: '',
    wind_speed: '',
    wind_direction: '',
  }


  // Set validation schemes for each variable
  const validationSchema = {
    cloud_cover: Yup.number(),
    pop: Yup.number()
      .min(0, "Can not have negative PoP %")
      .max(100, "PoP % can not exceed 100%"),
    high_temp: Yup.number()
      .min(-100, "Too improbable")
      .max(160, "Too improbable"),
    low_temp: Yup.number()
      .min(-100, "Too improbable")
      .max(160, "Too improbable"),
    wind_speed: Yup.string()
      .matches(
        /^(\d{1,3})[\s-]*(\d{1,3}[\s]*)*(mph|m\/s|ms|kn|kt|kts){0,1}\s*[gG]{0,1}(\d{0,3})[\s-]*(\d{0,3})$/,
        'Entry needs similar format to: 5-15mph G25-35'
    ),
    wind_direction: Yup.number()
      .min(0, "Invalid wind direction selected")
      .max(15, "Invalid wind direction selected"),
  }

  return (
    <div>Here is my form
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object(validationSchema)}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
          }, 400);
      }}
      >
        <Form>
          <Selection label="Cloud Cover" name="cloud_cover">
            <option value="---"></option>
          </Selection>
          <InputField
            label="PoP %"
            name="pop"
            type="text"
          />
          <InputField
            label="Max"
            name="high_temp"
            type="text"
          />
          <InputField
            label="Min"
            name="low_temp"
            type="text"
          />
          <InputField
            label="Wind Speed"
            name="wind_speed"
            type="text"
          />
          <Selection label="Wind Direction" name="wind_direction">
            <option value="---"></option>
          </Selection>
        </Form>
      </Formik>
    </div>
  )
}

export default ForecastForm