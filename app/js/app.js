import MostPopulatedCountriesChart from './charts/topCountries';
import WorldPopulationGrowthChart from './charts/populationGrowth';
import getPopulationData from './getPopulationData';

const DATA_PATH = 'data/population.csv';

getPopulationData(DATA_PATH)
    .then(data => {
        new MostPopulatedCountriesChart().show(data);
        new WorldPopulationGrowthChart().show(data.world);
    });
