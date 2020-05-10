import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Button from './Button';

type GridProps = {
  cells: boolean[];
};

type CellProps = {
  alive: boolean;
};

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const GridComponent = styled.div`
  background-color: rgba(255, 255, 255, 0.15);
  display: inline-grid;
  grid-template-rows: repeat(50, 1.25vmin);
  grid-template-columns: repeat(50, 1.25vmin);
  grid-gap: 1px;
  padding: 1vmin;
  margin: 2rem auto 1rem;
  border-radius: 0.25vmin;
`;

const CellComponent = styled.div`
  border-radius: 0.25vmin;
  background-color: ${(props: CellProps) =>
    props.alive ? '#95274f' : `#23043b`};
`;

const Controls = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
`;

const width = 50;
const height = 50;
const animationInterval = 50;
function randomCells() {
  return Array.from({ length: width * height }).map(() => Math.random() < 0.5);
}
let initialCells = randomCells();

const neighbors = initialCells.map(
  (_: any, i: number): number[] => {
    const y = Math.trunc(i / width);
    const x = i - width * y;
    const hasNorth = y > 0;
    const hasSouth = y < height - 1;
    const hasEast = x < width - 1;
    const hasWest = x > 0;
    return [
      hasNorth && hasWest ? i - width - 1 : null,
      hasNorth ? i - width : null,
      hasNorth && hasEast ? i - width + 1 : null,
      hasWest ? i - 1 : null,
      hasEast ? i + 1 : null,
      hasSouth && hasWest ? i + width - 1 : null,
      hasSouth ? i + width : null,
      hasSouth && hasEast ? i + width + 1 : null,
    ].filter(v => !!v);
  },
);

export default () => {
  const [cells, setCells] = useState(initialCells);
  const [isPlaying, setPlaying] = useState(false);

  const nextGeneration = useCallback(cells => {
    const newCells = cells.map((alive: boolean, i: number) => {
      // Get living neighbors
      const livingNbs = neighbors[i].filter(i => cells[i]).length;
      // 1. Any living cell with two or three living neighbors is a survivor.
      if (alive && (livingNbs === 2 || livingNbs === 3)) return true;
      // 2. Any dead cell with exactly three living neighbors is born.
      if (!alive && livingNbs === 3) return true;
      // 3. Everyone else dies or stays dead.
      return false;
    });

    if (cells.some((alive: boolean, i: number) => newCells[i] !== alive)) {
      return newCells;
    }

    setPlaying(false);
  }, []);

  const onPlay = () => setPlaying(!isPlaying);
  const onStep = () => setCells(nextGeneration);
  const onReset = () => {
    setPlaying(false);
    setCells(initialCells);
  };
  const onNewPattern = () => {
    initialCells = randomCells();
    setPlaying(false);
    setCells(initialCells);
  };

  useEffect(() => {
    const tick = () => setCells(nextGeneration);

    let id = null;
    if (isPlaying) {
      id = setInterval(tick, animationInterval);
    }
    return () => clearInterval(id);
  }, [isPlaying, nextGeneration]);

  return (
    <Container>
      <GridComponent>
        {cells.map((alive, i: number) => (
          <CellComponent key={`cell-${i}`} alive={alive} />
        ))}
      </GridComponent>
      <Controls>
        <Button
          label={isPlaying ? `Stop` : `Play`}
          active={isPlaying}
          onClick={onPlay}
        />
        <Button label="Step" onClick={onStep} />
        <Button label="Reset" onClick={onReset} />
        <Button label="New Pattern" onClick={onNewPattern} />
      </Controls>
    </Container>
  );
};
