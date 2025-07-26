import React, { useState } from "react";

interface ExpertiseFilterProps {
  onChange: (expertiseId: string) => void;
}

const ExpertiseFilter: React.FC<ExpertiseFilterProps> = ({ onChange }) => {
  const [selectedExpertise, setSelectedExpertise] = useState("");

  const EXPERTISE_OPTIONS = [
    { id: "1", label: "Culture & Heritage", description: "Explores the cultural and historical context of architecture, focusing on heritage conservation and cultural identity." },
    { id: "2", label: "Spatial Behavior & Psychology", description: "Studies how people interact with spaces and environments, emphasizing psychological and behavioral responses." },
    { id: "3", label: "Construction & Materials", description: "Focuses on building technologies, materials science, and construction methods for sustainable and efficient architecture." },
    { id: "4", label: "Housing, Planning & Urban Design", description: "Covers residential design, urban planning, and strategies for creating livable communities." },
    { id: "5", label: "Green Sustainable Architecture", description: "Promotes environmentally responsible design, energy efficiency, and sustainable building practices." },
    { id: "6", label: "Digital Technology & Architecture", description: "Examines the impact of digital tools, BIM, and computational design on architectural practice." },
    { id: "7", label: "Building Science & Performance", description: "Investigates building physics, performance analysis, and technical systems for optimized environments." },
    { id: "8", label: "Resilient Architecture & Building Safety", description: "Addresses disaster resilience, safety standards, and risk mitigation in the built environment." },
    { id: "9", label: "Architectural Design Theory & Education", description: "Explores design philosophies, pedagogies, and the evolution of architectural education." },
    { id: "10", label: "Architectural Practice & Project Management", description: "Covers professional practice, project delivery, and management skills for architects." },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedExpertise(value);
    onChange(value); // pass selected expertise ID to parent component
  };

  const selectedOption = EXPERTISE_OPTIONS.find(opt => opt.id === selectedExpertise);

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="expertise-select" style={{ marginRight: "0.5rem" }}>
        Filter by Expertise:
      </label>
      <select
        id="expertise-select"
        value={selectedExpertise}
        onChange={handleChange}
      >
        <option value="">All</option>
        {EXPERTISE_OPTIONS.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>
      {selectedOption && (
        <div style={{ marginTop: "0.75rem", color: "#555", fontSize: "0.95rem" }}>
          <strong>{selectedOption.label}:</strong> {selectedOption.description}
        </div>
      )}
    </div>
  );
};

export default ExpertiseFilter;
