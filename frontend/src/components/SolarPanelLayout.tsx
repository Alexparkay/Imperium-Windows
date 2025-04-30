import React, { useState, useEffect } from 'react';
import { MdSolarPower, MdWarning } from 'react-icons/md';

interface Panel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}

interface Obstruction {
  id: string;
  type: 'hvac' | 'skylight' | 'pipe' | 'other';
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SolarPanelLayoutProps {
  roofWidth: number;
  roofHeight: number;
  panelWidth: number;
  panelHeight: number;
  obstructions: Obstruction[];
  onLayoutComplete: (panels: Panel[]) => void;
}

const SETBACK_DISTANCE = 4; // 4 feet setback from edges and obstructions
const WALKWAY_WIDTH = 3; // 3 feet walkway width

const SolarPanelLayout: React.FC<SolarPanelLayoutProps> = ({
  roofWidth,
  roofHeight,
  panelWidth,
  panelHeight,
  obstructions,
  onLayoutComplete,
}) => {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [error, setError] = useState<string | null>(null);

  const calculateOptimalLayout = () => {
    try {
      const newPanels: Panel[] = [];
      let currentX = SETBACK_DISTANCE;
      let currentY = SETBACK_DISTANCE;
      let rowHeight = 0;
      let panelId = 1;

      // Sort obstructions by y-coordinate to optimize row placement
      const sortedObstructions = [...obstructions].sort((a, b) => a.y - b.y);

      while (currentY < roofHeight - SETBACK_DISTANCE) {
        // Check if we need to add a walkway
        const needsWalkway = newPanels.length > 0 && 
          newPanels[newPanels.length - 1].y + newPanels[newPanels.length - 1].height + WALKWAY_WIDTH < currentY;

        if (needsWalkway) {
          currentY += WALKWAY_WIDTH;
        }

        // Check for obstructions in current row
        const rowObstructions = sortedObstructions.filter(
          obs => obs.y >= currentY && obs.y < currentY + panelHeight
        );

        // Calculate available width for this row
        let availableWidth = roofWidth - (2 * SETBACK_DISTANCE);
        rowObstructions.forEach(obs => {
          if (obs.x > currentX) {
            availableWidth = obs.x - currentX - SETBACK_DISTANCE;
          }
        });

        // Place panels in current row
        while (currentX < roofWidth - SETBACK_DISTANCE && availableWidth >= panelWidth) {
          // Check if panel placement would overlap with any obstruction
          const wouldOverlap = rowObstructions.some(obs => 
            currentX < obs.x + obs.width + SETBACK_DISTANCE &&
            currentX + panelWidth > obs.x - SETBACK_DISTANCE
          );

          if (!wouldOverlap) {
            newPanels.push({
              id: `panel-${panelId++}`,
              x: currentX,
              y: currentY,
              width: panelWidth,
              height: panelHeight,
              orientation: 'landscape'
            });
            currentX += panelWidth + SETBACK_DISTANCE;
            availableWidth -= panelWidth + SETBACK_DISTANCE;
          } else {
            currentX += SETBACK_DISTANCE;
            availableWidth -= SETBACK_DISTANCE;
          }
        }

        // Move to next row
        currentX = SETBACK_DISTANCE;
        currentY += panelHeight + SETBACK_DISTANCE;
      }

      setPanels(newPanels);
      onLayoutComplete(newPanels);
      setError(null);
    } catch (err) {
      setError('Failed to calculate optimal panel layout. Please check roof dimensions and obstructions.');
      console.error('Layout calculation error:', err);
    }
  };

  useEffect(() => {
    calculateOptimalLayout();
  }, [roofWidth, roofHeight, panelWidth, panelHeight, obstructions]);

  return (
    <div className="relative w-full h-full">
      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-100 text-red-700 rounded-md mb-4">
          <MdWarning className="text-xl" />
          <span>{error}</span>
        </div>
      )}
      
      <div 
        className="relative border-2 border-gray-300"
        style={{
          width: roofWidth,
          height: roofHeight,
        }}
      >
        {/* Render obstructions */}
        {obstructions.map(obs => (
          <div
            key={obs.id}
            className="absolute bg-gray-400"
            style={{
              left: obs.x,
              top: obs.y,
              width: obs.width,
              height: obs.height,
            }}
          />
        ))}

        {/* Render panels */}
        {panels.map(panel => (
          <div
            key={panel.id}
            className="absolute bg-blue-500"
            style={{
              left: panel.x,
              top: panel.y,
              width: panel.width,
              height: panel.height,
            }}
          />
        ))}

        {/* Render setbacks */}
        <div className="absolute inset-0 border-4 border-yellow-400 opacity-50" />
      </div>
    </div>
  );
};

export default SolarPanelLayout; 