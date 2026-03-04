'use client';

import { useState } from 'react';
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
        <div className="p-6 text-center text-muted-foreground">
          No schools found
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
