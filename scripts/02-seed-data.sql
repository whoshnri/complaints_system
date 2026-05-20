-- Seed schools
INSERT INTO schools (name, description, created_at) VALUES
  ('Central High School', 'Main campus in downtown', NOW()),
  ('Lincoln Academy', 'Suburban campus', NOW()),
  ('West Park University', 'University campus', NOW());

-- Seed users (password is 'password123' hashed with bcrypt)
-- $2b$12$qSvjQQoVXo9QUMXpNDh0JuMLc2eAwhIxKr9vOQr0sxoEhbD1T3OYa is bcrypt hash of 'password123'
INSERT INTO users (email, password_hash, username, created_at) VALUES
  ('alice@example.com', '$2b$12$qSvjQQoVXo9QUMXpNDh0JuMLc2eAwhIxKr9vOQr0sxoEhbD1T3OYa', 'alice_student', NOW()),
  ('bob@example.com', '$2b$12$qSvjQQoVXo9QUMXpNDh0JuMLc2eAwhIxKr9vOQr0sxoEhbD1T3OYa', 'bob_voice', NOW()),
  ('charlie@example.com', '$2b$12$qSvjQQoVXo9QUMXpNDh0JuMLc2eAwhIxKr9vOQr0sxoEhbD1T3OYa', 'charlie_feedback', NOW());

-- Seed complaints
INSERT INTO complaints (user_id, school_id, title, description, category, urgency, status, is_public, created_at) VALUES
  (1, 1, 'Cafeteria food quality needs improvement', 'The cafeteria has been serving the same repetitive meals. We need more nutritious and diverse options. Students are tired of the same pasta and chicken every week.', 'facilities', 'medium', 'submitted', true, NOW() - INTERVAL '2 days'),
  (2, 1, 'Parking situation is getting worse', 'The parking lot is completely full by 8:30 AM. Many students have to park blocks away from campus. This is unfair and makes arriving late inevitable.', 'facilities', 'high', 'under_review', true, NOW() - INTERVAL '1 day'),
  (1, 2, 'Library hours should be extended', 'The library closes at 6 PM on weekdays, which is too early for students who have evening classes. We need at least 8 PM closing time.', 'academic', 'medium', 'submitted', true, NOW() - INTERVAL '12 hours'),
  (3, 1, 'Class sizes are too large', 'Most of my classes have 40+ students, making it hard for professors to give individual attention. Some classes should be split into smaller sections.', 'academic', 'high', 'under_review', true, NOW() - INTERVAL '6 hours'),
  (2, 3, 'Registration system needs a complete overhaul', 'The current registration website is slow and crashes during peak hours. The user interface is confusing and outdated. This needs immediate attention.', 'administrative', 'critical', 'resolved', true, NOW() - INTERVAL '3 hours'),
  (3, 2, 'Lack of mental health resources', 'The counseling center has a 3-week waiting list. Student mental health is suffering. We need more counselors and counseling services.', 'administrative', 'high', 'submitted', true, NOW() - INTERVAL '4 hours');

-- Seed upvotes for realistic engagement
INSERT INTO upvotes (complaint_id, user_id, created_at) VALUES
  (1, 2, NOW() - INTERVAL '1 day'),
  (1, 3, NOW() - INTERVAL '1 day'),
  (2, 1, NOW() - INTERVAL '18 hours'),
  (2, 3, NOW() - INTERVAL '18 hours'),
  (3, 2, NOW() - INTERVAL '10 hours'),
  (4, 1, NOW() - INTERVAL '5 hours'),
  (4, 2, NOW() - INTERVAL '4 hours'),
  (5, 1, NOW() - INTERVAL '2 hours');

-- Seed comments
INSERT INTO comments (complaint_id, user_id, content, is_admin_reply, created_at) VALUES
  (1, 2, 'Completely agree! The food quality has been declining. I wish they would listen to student feedback.', false, NOW() - INTERVAL '1 day'),
  (1, 3, 'The administration says they are working on better meal plans for next semester.', true, NOW() - INTERVAL '20 hours'),
  (2, 3, 'I have to park almost a mile away every day. It takes 20 minutes just to reach my first class!', false, NOW() - INTERVAL '18 hours'),
  (3, 1, 'Signed! The library needs to stay open later, especially during finals week.', false, NOW() - INTERVAL '10 hours'),
  (5, 2, 'The IT department has acknowledged the issues and is planning a new system for next year.', true, NOW() - INTERVAL '1 hour');
