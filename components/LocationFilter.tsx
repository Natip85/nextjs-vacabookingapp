"use client";
import { useEffect, useState } from "react";
import Container from "./Container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import useLocation from "@/hooks/useLocation";
import { ICity, IState } from "country-state-city";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Button } from "./ui/button";
const LocationFilter = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const { getAllCountries, getCountryStates, getStateCities } = useLocation();
  const countries = getAllCountries();

  useEffect(() => {
    const countryStates = getCountryStates(country);
    if (countryStates) {
      setStates(countryStates);
      setState("");
      setCity("");
    }
  }, [country]);

  useEffect(() => {
    const stateCities = getStateCities(country, state);
    if (stateCities) {
      setCities(stateCities);
      setCity("");
    }
  }, [country, state]);

  useEffect(() => {
    if (country === "" && state === "" && city === "") return router.push("/");
    let currentQuery: any = {};
    if (params) {
      currentQuery = qs.parse(params.toString());
    }
    if (country) {
      currentQuery = { ...currentQuery, country };
    }
    if (state) {
      currentQuery = { ...currentQuery, state };
    }
    if (city) {
      currentQuery = { ...currentQuery, city };
    }
    if (state === "" && currentQuery.state) {
      delete currentQuery.state;
    }
    if (city === "" && currentQuery.city) {
      delete currentQuery.city;
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: currentQuery,
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  }, [country, state, city]);

  const handleClear = () => {
    router.push("/");
    setCountry("");
    setState("");
    setCity("");
  };
  return (
    <Container>
      <div className="flex gap-2 md:gap-4 items-center justify-center text-sm">
        <div>
          <Select value={country} onValueChange={(value) => setCountry(value)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => {
                return (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={state} onValueChange={(value) => setState(value)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              {states.length > 0 &&
                states.map((state) => {
                  return (
                    <SelectItem key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={city} onValueChange={(value) => setCity(value)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              {cities.length > 0 &&
                cities.map((city) => {
                  return (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => handleClear()} variant={"outline"}>
          Clear filters
        </Button>
      </div>
    </Container>
  );
};

export default LocationFilter;
