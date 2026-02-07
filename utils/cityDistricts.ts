
import cityData from '@/constants/cityAndDistricts.json';

interface District {
    value: number;
    text: string;
}

interface City {
    value: number;
    text: string;
    districts: District[];
}

export function getAllCities(): string[] {
    return (cityData as City[]).map(city => city.text);
}

export function getDistrictsForCity(cityName: string): string[] {
    const city = (cityData as City[]).find(c => c.text === cityName);
    return city ? city.districts.map(d => d.text) : [];
}
