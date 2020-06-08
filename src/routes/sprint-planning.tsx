import React, { ReactElement, useState } from 'react';
import { Chart } from 'react-google-charts';
import styled from 'styled-components';

const Container = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  padding: 4rem 2rem;
  width: 100%;
`;
const Form = styled.form`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;
const Label = styled.label`
  color: #718096;
  display: block;
  letter-spacing: 0.065em;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
`;

interface SimulationResult {
  numberOfStories: number;
  probability: number;
}

function simulate(throughputs: number[], numberOfSprints: number): SimulationResult[] {
  const results: SimulationResult[] = [];

  for (let i = 1; i <= Math.max(...throughputs) * numberOfSprints; i++) {
    const result: SimulationResult = {
      numberOfStories: i,
      probability: 0
    };

    let successful = 0;
    let total = 0;

    for (let j = 0; j < 10000; j++) {
      const predictedThroughput = [...throughputs]
        .sort(() => Math.random() <= 0.5 ? 1 : -1)
        .slice(0, numberOfSprints)
        .reduce((sum, v) => sum + v, 0);

      if (i <= predictedThroughput) {
        successful += 1;
      }

      total += 1;
    }


    result.probability = Math.round(successful / total * 100);

    results.push(result);
  }

  return results;
}

export default function SprintPlanning(): ReactElement {
  const [ throughputs, setThroughputs ] = useState([12, 17, 9, 17, 14, 8, 13]);
  const [ numberOfSprints, setNumberOfSprints ] = useState(1);

  const results = simulate(throughputs, numberOfSprints);

  const colors = ['#003f5c', '#2f4b7c', '#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600'];
  const data = [
    ['Number of Stories', 'Probability (%)', { role: "style" }],
    ...results.map((result, i) => [ `${ result.numberOfStories }`, result.probability, colors[i % colors.length] ])
  ];

  return (
    <Container>
      <Form>
        <div>
          <Label>Throughput values (Comma separated)</Label>
          <input type="text" defaultValue={ throughputs.join(',') } onChange={ event => setThroughputs(event.currentTarget.value.split(',').map(v => parseInt(v, 10))) }/>
        </div>
        <div>
          <Label>Number of sprints</Label>
          <input type="number" defaultValue={ numberOfSprints } onChange={ event => setNumberOfSprints(parseInt(event.currentTarget.value, 10)) }/>
        </div>
      </Form>
      <div>
        <Chart
            chartType="ColumnChart"
            data={ data }
            width="100%"
            height="600px"
            legendToggle
          />
      </div>
    </Container>
  );
}
