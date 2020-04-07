import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';

import { useWindowDimensions } from '../../hooks';
import { fetchDailyData } from '../../api';

import styles from './Chart.module.css';

const Chart = ({ data: { confirmed, recovered, deaths }, country }) => {
  const [dailyData, setDailyData] = useState([]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchAPI = async () => {
      const result = await fetchDailyData();
      setDailyData(result);
    };
    fetchAPI();
  }, []);

  const options =
    width < 720
      ? {
          scales: {
            yAxes: [
              {
                ticks: {
                  display: false,
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  display: false,
                },
              },
            ],
          },
        }
      : {
          scales: {
            yAxes: [
              {
                ticks: {
                  display: true,
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  display: true,
                },
              },
            ],
          },
        };

  const lineChart = dailyData.length ? (
    <Line
      data={{
        labels: dailyData.map(({ date }) => date),
        datasets: [
          {
            data: dailyData.map(({ confirmed }) => confirmed),
            label: 'Infected',
            borderColor: '#3333ff',
            fill: true,
          },
          {
            data: dailyData.map(({ deaths }) => deaths),
            label: 'Deaths',
            borderColor: 'red',
            backgroundColor: 'rgba(255,0,0,0.5)',
            fill: true,
          },
        ],
      }}
      options={options}
    />
  ) : null;

  const barChart = confirmed ? (
    <Bar
      data={{
        labels: ['Infected', 'Recovered', 'Deaths'],
        datasets: [
          {
            label: 'People',
            backgroundColor: [
              'rgba(0, 0, 255, 0.5)',
              'rgba(0, 255, 0, 0.5)',
              'rgba(255, 0, 0, 0.5)',
            ],
            data: [confirmed.value, recovered.value, deaths.value],
          },
        ],
      }}
      options={{
        legend: { display: false },
        title: { display: true, text: `Current state in ${country}` },
      }}
    />
  ) : null;

  return (
    <div className={styles.container}>{country ? barChart : lineChart}</div>
  );
};

export default Chart;
