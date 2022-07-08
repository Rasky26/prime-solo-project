// Import the used components
import ForecastForm from "./ForecastForm"

// Component that handles the display of the forecast
// form cards for all days of the allowed forecast
export default function ForecastFormsContainer() {

    // Build the DOM elements
    return (
        <section>
            <ForecastForm />
        </section>
    )
}