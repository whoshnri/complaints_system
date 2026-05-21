'use client';

import { useState } from 'react';
import { School2 } from 'lucide-react';
import SchoolCard, { School } from './school-card';

interface SchoolsListProps {
  initialSchools: School[];
  followedSchoolIds: number[];
}

export default function SchoolsList({ initialSchools, followedSchoolIds }: SchoolsListProps) {
  const [schools] = useState(initialSchools);
  const followedSet = new Set(followedSchoolIds);

  return (
    <div className="divide-y divide-border">
      {schools.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="mb-5 flex size-14 items-center justify-center rounded-lg bg-secondary text-primary">
            <School2 size={28} />
          </div>
          <h2 className="text-lg font-semibold text-foreground">No schools have been added</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Once schools or departments are registered, students can follow them and complaints will be organized by institution.
          </p>
        </div>
      ) : (
        schools.map((school) => (
          <SchoolCard
            key={school.id}
            school={school}
            isFollowed={followedSet.has(school.id)}
          />
        ))
      )}
    </div>
  );
}
