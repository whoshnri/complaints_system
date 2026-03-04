'use client';

import { useEffect, useState } from 'react';
import { getSchoolsAction } from '@/app/actions/complaints';
import { ChevronDown } from 'lucide-react';

interface SchoolFilterProps {
  selectedSchool: string | null;
  onSelectSchool: (schoolId: string | null) => void;
}

interface School {
  id: string;
  name: string;
}

export default function SchoolFilter({ selectedSchool, onSelectSchool }: SchoolFilterProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSchoolName, setSelectedSchoolName] = useState<string>('All Schools');

  useEffect(() => {
    async function loadSchools() {
      const { data } = await getSchoolsAction();
      if (data) {
        setSchools(data as School[]);
      }
    }
    loadSchools();
  }, []);

  const handleSelect = (schoolId: string | null, schoolName: string) => {
    onSelectSchool(schoolId);
    setSelectedSchoolName(schoolName);
    setIsOpen(false);
  };

  return (
    <div className="border-b border-border px-4 py-3">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-2 bg-secondary hover:bg-input rounded transition-colors"
        >
          <span className="font-medium text-sm text-foreground">{selectedSchoolName}</span>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded shadow-md z-20">
            <button
              onClick={() => handleSelect(null, 'All Schools')}
              className={`w-full text-left px-4 py-2 hover:bg-secondary transition-colors ${
                selectedSchool === null ? 'bg-secondary font-medium' : ''
              }`}
            >
              All Schools
            </button>

            {schools.map((school) => (
              <button
                key={school.id}
                onClick={() => handleSelect(school.id, school.name)}
                className={`w-full text-left px-4 py-2 hover:bg-secondary transition-colors ${
                  selectedSchool === school.id ? 'bg-secondary font-medium' : ''
                }`}
              >
                {school.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
