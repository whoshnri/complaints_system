'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createComplaintAction, getSchoolsAction } from '@/app/actions/complaints';

interface School {
  id: number;
  name: string;
}

const COMPLAINT_CATEGORIES = [
  'Academic',
  'Administrative',
  'Facilities',
  'Financial',
  'Health & Safety',
  'Library',
  'Sports & Recreation',
  'Student Services',
  'Technology',
  'Other',
];

export default function ComposeForm() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingSchools, setLoadingSchools] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const { data } = await getSchoolsAction();
        setSchools(data as School[] || []);
        if (data && data.length > 0) {
          setSelectedSchoolId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load schools:', err);
        setError('Failed to load schools');
      } finally {
        setLoadingSchools(false);
      }
    };

    fetchSchools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!selectedSchoolId) {
        setError('Please select a school');
        setLoading(false);
        return;
      }

      const { data, error: actionError } = await createComplaintAction(
        Number(selectedSchoolId),
        title,
        description,
        isPublic,
        category || undefined
      );

      if (actionError) {
        setError(actionError);
        setLoading(false);
        return;
      }

      // Redirect to the feed after successful creation
      router.push('/feed');
    } catch (err) {
      console.error('Error creating complaint:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  if (loadingSchools) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading schools...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="divide-y divide-border">
      <div className="p-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Target School or Department
        </label>
        <select
          value={selectedSchoolId}
          onChange={(e) => setSelectedSchoolId(Number(e.target.value))}
          className="w-full px-3 py-2 bg-input border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="">-- Choose a school --</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 bg-input border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">-- Select a category (optional) --</option>
          {COMPLAINT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Cafeteria food needs improvement"
          className="w-full px-3 py-2 bg-input border border-border text-foreground placeholder-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={200}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          {title.length}/200 characters
        </p>
      </div>

      <div className="p-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Detailed Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your complaint in detail. Be specific about what needs to change..."
          className="w-full px-3 py-2 bg-input border border-border text-foreground placeholder-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none h-40"
          required
        />
      </div>

      <div className="p-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 border border-border rounded cursor-pointer"
          />
          <span className="text-sm text-foreground">
            Post publicly (share with all users)
          </span>
        </label>
        <p className="text-xs text-muted-foreground mt-2">
          {isPublic
            ? 'Your complaint will be visible to all users'
            : 'Your complaint will only be visible to your school'}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border-t border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="p-4 flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-4 py-2 text-foreground border border-border rounded-md hover:bg-secondary transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-foreground text-background rounded-md hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Posting...' : 'Post Complaint'}
        </button>
      </div>
    </form>
  );
}
