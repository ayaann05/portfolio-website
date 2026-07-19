const { useEffect, useMemo, useRef, useState } = React;
const h = React.createElement;

const locations = ['petrie', 'britannia', 'mooneys', 'dows'];
const months = ['may', 'june', 'july', 'august', 'september'];
const species = ['bass', 'pike', 'perch', 'sunfish'];

const fishingData = {
  petrie: {
    may:       { bass: 18, pike: 12, perch: 24, sunfish: 29 },
    june:      { bass: 26, pike: 15, perch: 31, sunfish: 38 },
    july:      { bass: 34, pike: 17, perch: 28, sunfish: 43 },
    august:    { bass: 30, pike: 14, perch: 25, sunfish: 39 },
    september: { bass: 21, pike: 18, perch: 22, sunfish: 27 }
  },
  britannia: {
    may:       { bass: 15, pike: 9,  perch: 27, sunfish: 22 },
    june:      { bass: 23, pike: 12, perch: 34, sunfish: 31 },
    july:      { bass: 29, pike: 13, perch: 32, sunfish: 36 },
    august:    { bass: 27, pike: 11, perch: 29, sunfish: 33 },
    september: { bass: 19, pike: 14, perch: 24, sunfish: 20 }
  },
  mooneys: {
    may:       { bass: 12, pike: 7,  perch: 21, sunfish: 25 },
    june:      { bass: 20, pike: 10, perch: 28, sunfish: 35 },
    july:      { bass: 27, pike: 9,  perch: 25, sunfish: 41 },
    august:    { bass: 24, pike: 8,  perch: 23, sunfish: 37 },
    september: { bass: 16, pike: 11, perch: 19, sunfish: 24 }
  },
  dows: {
    may:       { bass: 10, pike: 6,  perch: 18, sunfish: 20 },
    june:      { bass: 17, pike: 8,  perch: 25, sunfish: 30 },
    july:      { bass: 22, pike: 7,  perch: 23, sunfish: 34 },
    august:    { bass: 21, pike: 7,  perch: 20, sunfish: 31 },
    september: { bass: 14, pike: 9,  perch: 17, sunfish: 21 }
  }
};

const translations = {
  en: {
    language: 'Language',
    english: 'English',
    french: 'Français',
    back: 'Back to Portfolio',
    eyebrow: 'Ottawa fishing activity',
    title: 'Fishing Activity Dashboard',
    introduction: 'Compare estimated catches by species and explore how fishing activity changes through the season.',
    totalCatch: 'Total catches',
    topSpecies: 'Most active species',
    selectedLocation: 'Selected location',
    chartOneTitle: 'Catches by species',
    chartOneText: 'Compare the number of recorded catches for one location and month.',
    chartTwoTitle: 'Seasonal catch trend',
    chartTwoText: 'Follow one species across the fishing season at a selected location.',
    location: 'Location',
    month: 'Month',
    species: 'Species',
    catches: 'Recorded catches',
    source: 'This dashboard uses a small synthetic dataset created for visualization purposes. The values do not represent official catch records.',
    locations: {
      petrie: 'Petrie Island',
      britannia: 'Britannia Bay',
      mooneys: "Mooney's Bay",
      dows: "Dow's Lake"
    },
    months: {
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September'
    },
    speciesNames: {
      bass: 'Bass',
      pike: 'Northern pike',
      perch: 'Yellow perch',
      sunfish: 'Sunfish'
    }
  },
  fr: {
    language: 'Langue',
    english: 'English',
    french: 'Français',
    back: 'Retour au portfolio',
    eyebrow: 'Activité de pêche à Ottawa',
    title: 'Tableau de bord de la pêche',
    introduction: "Comparez les prises estimées par espèce et découvrez l'évolution de l'activité de pêche pendant la saison.",
    totalCatch: 'Prises totales',
    topSpecies: 'Espèce la plus active',
    selectedLocation: 'Lieu sélectionné',
    chartOneTitle: 'Prises par espèce',
    chartOneText: 'Comparez le nombre de prises enregistrées pour un lieu et un mois.',
    chartTwoTitle: 'Tendance saisonnière des prises',
    chartTwoText: "Suivez une espèce pendant la saison de pêche à l'endroit sélectionné.",
    location: 'Lieu',
    month: 'Mois',
    species: 'Espèce',
    catches: 'Prises enregistrées',
    source: "Ce tableau de bord utilise un petit ensemble de données synthétiques créé à des fins de visualisation. Les valeurs ne représentent pas des registres officiels.",
    locations: {
      petrie: 'Île Petrie',
      britannia: 'Baie Britannia',
      mooneys: 'Baie Mooney',
      dows: 'Lac Dow'
    },
    months: {
      may: 'Mai',
      june: 'Juin',
      july: 'Juillet',
      august: 'Août',
      september: 'Septembre'
    },
    speciesNames: {
      bass: 'Achigan',
      pike: 'Grand brochet',
      perch: 'Perchaude',
      sunfish: 'Crapet'
    }
  }
};

function App() {
  const [language, setLanguage] = useState('en');
  const [barLocation, setBarLocation] = useState('petrie');
  const [barMonth, setBarMonth] = useState('july');
  const [lineLocation, setLineLocation] = useState('petrie');
  const [lineSpecies, setLineSpecies] = useState('bass');

  const text = translations[language];
  const selectedValues = fishingData[barLocation][barMonth];

  const summary = useMemo(() => {
    const total = species.reduce((sum, fish) => sum + selectedValues[fish], 0);
    const mostActive = species.reduce((best, fish) =>
      selectedValues[fish] > selectedValues[best] ? fish : best
    );
    return { total, mostActive };
  }, [barLocation, barMonth]);

  return h('div', { className: 'page-shell' },
    h('header', { className: 'topbar' },
      h('a', { href: '../index.html', className: 'back-link' }, '← ', text.back),
      h('div', { className: 'language-control' },
        h('span', null, text.language),
        h('button', {
          className: language === 'en' ? 'language-button active' : 'language-button',
          onClick: () => setLanguage('en')
        }, text.english),
        h('button', {
          className: language === 'fr' ? 'language-button active' : 'language-button',
          onClick: () => setLanguage('fr')
        }, text.french)
      )
    ),

    h('main', { className: 'dashboard' },
      h('section', { className: 'hero' },
        h('div', null,
          h('p', { className: 'eyebrow' }, text.eyebrow),
          h('h1', null, text.title),
          h('p', { className: 'hero-text' }, text.introduction)
        ),
        h('div', { className: 'hero-icon', 'aria-hidden': 'true' }, '🎣')
      ),

      h('section', { className: 'summary-grid', 'aria-label': 'Dashboard summary' },
        h(SummaryCard, { label: text.totalCatch, value: summary.total }),
        h(SummaryCard, { label: text.topSpecies, value: text.speciesNames[summary.mostActive] }),
        h(SummaryCard, { label: text.selectedLocation, value: text.locations[barLocation] })
      ),

      h('section', { className: 'chart-grid' },
        h(BarChartCard, {
          language,
          text,
          location: barLocation,
          month: barMonth,
          setLocation: setBarLocation,
          setMonth: setBarMonth
        }),
        h(LineChartCard, {
          language,
          text,
          location: lineLocation,
          fish: lineSpecies,
          setLocation: setLineLocation,
          setFish: setLineSpecies
        })
      ),

      h('p', { className: 'data-note' }, text.source)
    )
  );
}

function SummaryCard({ label, value }) {
  return h('article', { className: 'summary-card' },
    h('p', null, label),
    h('strong', null, value)
  );
}

function SelectField({ id, label, value, onChange, options, labels }) {
  return h('label', { className: 'select-field', htmlFor: id },
    h('span', null, label),
    h('select', {
      id,
      value,
      onChange: event => onChange(event.target.value)
    }, options.map(option =>
      h('option', { key: option, value: option }, labels[option])
    ))
  );
}

function BarChartCard({ language, text, location, month, setLocation, setMonth }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();

    const values = fishingData[location][month];
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: species.map(fish => text.speciesNames[fish]),
        datasets: [{
          label: text.catches,
          data: species.map(fish => values[fish]),
          backgroundColor: ['#275d4f', '#4c806f', '#79aa96', '#afd0c2'],
          borderRadius: 7,
          borderSkipped: false
        }]
      },
      options: chartOptions(text.catches)
    });

    return () => chartRef.current && chartRef.current.destroy();
  }, [language, location, month]);

  return h('article', { className: 'chart-card' },
    h('div', { className: 'chart-heading' },
      h('div', null,
        h('h2', null, text.chartOneTitle),
        h('p', null, text.chartOneText)
      )
    ),
    h('div', { className: 'filters' },
      h(SelectField, {
        id: 'bar-location',
        label: text.location,
        value: location,
        onChange: setLocation,
        options: locations,
        labels: text.locations
      }),
      h(SelectField, {
        id: 'bar-month',
        label: text.month,
        value: month,
        onChange: setMonth,
        options: months,
        labels: text.months
      })
    ),
    h('div', { className: 'canvas-wrap' },
      h('canvas', { ref: canvasRef, role: 'img', 'aria-label': text.chartOneTitle })
    )
  );
}

function LineChartCard({ language, text, location, fish, setLocation, setFish }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: months.map(month => text.months[month]),
        datasets: [{
          label: text.speciesNames[fish],
          data: months.map(month => fishingData[location][month][fish]),
          borderColor: '#d9783d',
          backgroundColor: 'rgba(217, 120, 61, 0.15)',
          pointBackgroundColor: '#d9783d',
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 3,
          tension: 0.3,
          fill: true
        }]
      },
      options: chartOptions(text.catches)
    });

    return () => chartRef.current && chartRef.current.destroy();
  }, [language, location, fish]);

  return h('article', { className: 'chart-card' },
    h('div', { className: 'chart-heading' },
      h('div', null,
        h('h2', null, text.chartTwoTitle),
        h('p', null, text.chartTwoText)
      )
    ),
    h('div', { className: 'filters' },
      h(SelectField, {
        id: 'line-location',
        label: text.location,
        value: location,
        onChange: setLocation,
        options: locations,
        labels: text.locations
      }),
      h(SelectField, {
        id: 'line-species',
        label: text.species,
        value: fish,
        onChange: setFish,
        options: species,
        labels: text.speciesNames
      })
    ),
    h('div', { className: 'canvas-wrap' },
      h('canvas', { ref: canvasRef, role: 'img', 'aria-label': text.chartTwoTitle })
    )
  );
}

function chartOptions(axisTitle) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#16362f',
        padding: 12,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#4f625d'
        }
      },
      y: {
        beginAtZero: true,
        suggestedMax: 50,
        title: {
          display: true,
          text: axisTitle,
          color: '#4f625d',
          font: {
            weight: '600'
          }
        },
        grid: {
          color: '#e8eeeb'
        },
        ticks: {
          precision: 0,
          color: '#4f625d'
        }
      }
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
