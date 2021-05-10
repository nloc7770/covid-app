import React, { useEffect, useState } from "react";
import "./App.css";
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, settableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 19, lng: 40 });
  const [zoom, setZoom] = useState(2.5);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseTypes, setcaseTypes] = useState("cases");
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const newdata = data.sort((a, b) => {
            if (a.cases > b.cases) {
              return -1;
            } else {
              return 1;
            }
          });
          settableData(newdata);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    setCountry(country);
    const countriesCode = event.target.value;
    const url =
      countriesCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countriesCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countriesCode);
        setCountryInfo(data);
        if (countriesCode === "worldwide") {
          setMapCenter([34, -40]);
          setZoom(3);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setZoom(4);
        }
      });
  };
  return (
    <div className="App">
      <div className="covid_left">
        <div className="covid_header">
          <h1 className="title">Covid app</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Thế giới</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="covid_stats">
          <InfoBox
          isRed
          active={caseTypes === "cases"}
            onClick={(e) => setcaseTypes("cases")}
            title="Số ca mắc"
            total={String(countryInfo.cases).replace(
              /(.)(?=(\d{3})+$)/g,
              "$1,"
            )}
          ></InfoBox>
          <InfoBox
          isOrange
          active={caseTypes === "active"}
            onClick={(e) => setcaseTypes("active")}
            title="Đang điều trị"
            total={String(countryInfo.active).replace(
              /(.)(?=(\d{3})+$)/g,
              "$1,"
            )}
          ></InfoBox>
          <InfoBox
          isGreen
          active={caseTypes === "recovered"}
            onClick={(e) => setcaseTypes("recovered")}
            title="Đã hồi phục"
            total={String(countryInfo.recovered).replace(
              /(.)(?=(\d{3})+$)/g,
              "$1,"
            )}
          ></InfoBox>
          <InfoBox
          isBlack
          active={caseTypes === "deaths"}
            onClick={(e) => setcaseTypes("deaths")}
            title="Tử vong"
            total={String(countryInfo.deaths).replace(
              /(.)(?=(\d{3})+$)/g,
              "$1,"
            )}
          ></InfoBox>
        </div>
        <Map
          casesType={caseTypes}
          countries={mapCountries}
          center={mapCenter}
          zoom={zoom}
        />
      </div>
      <Card className="covid_right">
        <CardContent>
          <h3>Số ca mắc</h3>
          <Table countries={tableData}></Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
