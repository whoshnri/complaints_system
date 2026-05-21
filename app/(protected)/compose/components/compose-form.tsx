'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createComplaintAction, getSchoolsAction } from '@/app/actions/complaints';

interface School {
  id: number;
  name: string;
}

export default function ComposeForm() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('academic');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
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
        content,
        category,
        urgency
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
          Select Your School
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
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Cafeteria food needs improvement"
          className="w-full px-3 py-2 bg-input border border-border text-foreground placeholder-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={255}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          {title.length}/255 characters
        </p>
      </div>

      <div className="p-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Complaint Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 bg-input border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="academic">Academic</option>
          <option value="administrative">Administrative</option>
          <option value="facilities">Facilities</option>
          <option value="financial">Financial</option>
          <option value="welfare">Welfare</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="p-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Urgency
        </label>
        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value as 'low' | 'medium' | 'high' | 'critical')}
          className="w-full px-3 py-2 bg-input border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="p-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Your Complaint
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe your feedback in detail. Be specific about what needs to change..."
          className="w-full px-3 py-2 bg-input border border-border text-foreground placeholder-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none h-40"
          required
        />
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
          className="flex-1 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Complaint'}
        </button>
      </div>
    </form>
  );
}
