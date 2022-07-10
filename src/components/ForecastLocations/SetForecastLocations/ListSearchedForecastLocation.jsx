export default function ListSearchedForecastLocation({ searchItem }) {

    return (
        <div>
            <p>{searchItem.station}</p>
            <p>{searchItem.name} - {searchItem.state}</p>
        </div>
    )
}