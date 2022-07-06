// Import used functions and components
import { Link } from "react-router-dom"

// Import stylesheet
import styles from "./HomePage.module.css"

// Component that displays when the user is not logged in.
// Links the user to the `Login` or `Registration` pages.
export default function HomePageNotLoggedIn() {

    // Build the DOM elements
    return (
        <section>
            <h2>Weather Forecasting Made Easy</h2>
            <p className={styles.p}><span className={styles.emphasis}>Met Helper</span> is designed for meteorologists for meteorologists to assist in streamlining their daily duties. Easily forecast fro the cities you need, update you data from any computer, and track you accuracy.</p>
            <p>This site is designed to improve the lives of meteorologists. The primary focus is you; not your television station, forecasting office, of the consumers of your weather forecasts.</p>
            <p>We are open to requests and improvements to make your forecasting life easier and more enjoyable. Login to start forecfasting or request improvements.</p>
            <div className="button-container">
                <Link to="/login" className={styles.homepage_buttons}>Login</Link>
                <Link to="/registration" className={styles.homepage_buttons}>Register</Link>
            </div>
        </section>
    )
}