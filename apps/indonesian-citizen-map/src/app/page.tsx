'use client';

import { EchartConfigs, GeoChart, GeoChartRefs } from "./components/geo-chart";

import React from "react";
import { provinceNameMap } from "./components/geo-json-normalized";

export default function Index() {

  const geoChartRefs = React.useRef<GeoChartRefs>(null);
  // dalam ribu jiwa
  const populations = [
    { name: 'Aceh', value: 5554.8 },
    { name: 'Sumatera Utara', value: 15588.5 },
    { name: 'Sumatera Barat', value: 5836.2 },
    { name: 'Riau', value: 6728.1 },
    { name: 'Kep. Riau', value: 2183.3 },
    { name: 'Jambi', value: 3724.3 },
    { name: 'Sumatera Selatan', value: 8837.3 },
    { name: 'Kep. Bangka Belitung', value: 1531.5 },
    { name: 'Bengkulu', value: 2112.2 },
    { name: 'Lampung', value: 9419.6 },
    { name: 'DKI Jakarta', value: 10684.9 },
    { name: 'Jawa Barat', value: 50345.2 },
    { name: 'Banten', value: 12431.4 },
    { name: 'Jawa Tengah', value: 37892.3 },
    { name: 'DI Yogyakarta', value: 3759.5 },
    { name: 'Jawa Timur', value: 41814.5 },
    { name: 'Kalimantan Barat', value: 5695.5 },
    { name: 'Kalimantan Tengah', value: 2809.7 },
    { name: 'Kalimantan Selatan', value: 4273.4 },
    { name: 'Kalimantan Timur', value: 4045.9 },
    { name: 'Kalimantan Utara', value: 739.8 },
    { name: 'Sulawesi Utara', value: 2701.8 },
    { name: 'Gorontalo', value: 1227.8 },
    { name: 'Sulawesi Tengah', value: 3121.8 },
    { name: 'Sulawesi Selatan', value: 9463.4 },
    { name: 'Sulawesi Barat', value: 1503.2 },
    { name: 'Sulawesi Tenggara', value: 2793.1 },
    { name: 'Bali', value: 4433.3 },
    { name: 'Nusa Tenggara Barat', value: 5646 },
    { name: 'Nusa Tenggara Timur', value: 5656 },
    { name: 'Maluku', value: 1945.6 },
    { name: 'Maluku Utara', value: 1355.6 },
    { name: 'Papua Barat', value: 1205.8 },
    { name: 'Papua', value: 4542.6 },
  ];

  const totalPopulations = populations.reduce((sum, d) => {
    return sum + (d.value * 1000);
  }, 0);

  const enrichedPopulations = populations.map((population) => ({
    ...population,
    name: provinceNameMap[population.name] || population.name,
    valueUnit: '(in thousands) people',
    actualValue: population.value * 1000,
    actualValueUnit: 'people',
    percentageValue: (((population.value * 1000) / totalPopulations) * 100),
    percentageValueUnit: 'percentile',
    percentageDisplayValue: (((population.value * 1000) / totalPopulations) * 100).toFixed(2).concat(" %")
  }));
  
  const echartConfigs: EchartConfigs = {
    options: {
      title: {
        text: 'Indonesia Population Estimates (2024)',
        subtext: 'Data from www.census.gov',
        sublink: 'http://www.census.gov/popest/data/datasets.html',
        left: 'right'
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        formatter: (params: any) => {
          const { name, value } = params.data || {};
          const population = enrichedPopulations.find(d => d.name === name);
          return `${name}<br/>Population: ${value?.toLocaleString()}<br/>Percentage: ${population?.percentageDisplayValue}`;
        }
      },
      visualMap: {
        left: 'right',
        min: 1,
        max: 10000,
        inRange: {
          color: [
            '#313695',
            '#4575b4',
            '#74add1',
            '#abd9e9',
            '#e0f3f8',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026'
          ]
        },
        text: ["High Population's", "Low Population's"],
        calculable: true
      },
      toolbox: {
        show: true,
        //orient: 'vertical',
        left: 'left',
        top: 'top',
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {}
        }
      },
      series: [
        {
          name: 'Indonesia Pop Estimate',
          type: 'map',
          roam: true,
          map: 'indonesia',
          nameProperty: 'province',
          emphasis: {
            label: {
              show: true
            }
          },
          data: [
            ...enrichedPopulations,
          ]
        }
      ]
    },
  };

  const geoJson = {
    name: 'indonesia',
    url: '/api/geojson'
  }
  
  return (
    <div className="w-full h-screen">
      {/* Render chart */}
      <div className="w-full h-full p-[100px]">
        <GeoChart 
          styleProps={{
            width: '100%',
            height: '100%'
          }} 
          ref={geoChartRefs}
          echartConfigs={echartConfigs} 
          geoJson={geoJson}
          key={'echart-geo-id'} 
          title="Data Penduduk Indonesia" 
          subTitle="Grafik sebaran data penduduk indonesia per tahun 2024"
        />
      </div>
    </div>
  );
}
