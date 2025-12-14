-- Insert sample company
INSERT INTO companies (name, registration_number, industry, contact_email, contact_phone)
VALUES ('Acme Corporation Ltd.', 'U12345MH2020PTC123456', 'Technology', 'contact@acmecorp.com', '+91-22-12345678');

-- Insert sample tasks
INSERT INTO tasks (title, description, company_id, assignee_id, created_by, status, priority, due_date, progress, tags)
SELECT
  'Annual ROC Filing - MGT-7 & AOC-4',
  'Complete and file Annual Return (MGT-7) and Financial Statements (AOC-4) with the Registrar of Companies before the statutory deadline.',
  c.id,
  p.id,
  p.id,
  'in_progress',
  'high',
  CURRENT_DATE + INTERVAL '15 days',
  45,
  ARRAY['ROC', 'Annual Filing', 'Compliance']
FROM companies c, profiles p
WHERE c.name = 'Acme Corporation Ltd.'
LIMIT 1;

INSERT INTO tasks (title, description, company_id, assignee_id, created_by, status, priority, due_date, progress, tags)
SELECT
  'DIR-3 KYC for Directors',
  'File DIR-3 KYC for all active directors before September 30th deadline.',
  c.id,
  p.id,
  p.id,
  'pending',
  'medium',
  CURRENT_DATE + INTERVAL '30 days',
  0,
  ARRAY['Directors', 'KYC', 'Compliance']
FROM companies c, profiles p
WHERE c.name = 'Acme Corporation Ltd.'
LIMIT 1;

INSERT INTO tasks (title, description, company_id, assignee_id, created_by, status, priority, due_date, progress, tags)
SELECT
  'Board Meeting Minutes - Q4',
  'Prepare and circulate board meeting minutes for Q4 review and approval.',
  c.id,
  p.id,
  p.id,
  'review',
  'low',
  CURRENT_DATE + INTERVAL '7 days',
  80,
  ARRAY['Board', 'Minutes', 'Documentation']
FROM companies c, profiles p
WHERE c.name = 'Acme Corporation Ltd.'
LIMIT 1;

INSERT INTO tasks (title, description, company_id, assignee_id, created_by, status, priority, due_date, progress, tags)
SELECT
  'GST Return Filing - GSTR-3B',
  'File monthly GST return GSTR-3B for the current tax period.',
  c.id,
  p.id,
  p.id,
  'pending',
  'high',
  CURRENT_DATE + INTERVAL '5 days',
  20,
  ARRAY['GST', 'Tax', 'Monthly']
FROM companies c, profiles p
WHERE c.name = 'Acme Corporation Ltd.'
LIMIT 1;

INSERT INTO tasks (title, description, company_id, assignee_id, created_by, status, priority, due_date, progress, tags)
SELECT
  'Update Registered Office Address',
  'File INC-22 to update the registered office address change with MCA.',
  c.id,
  p.id,
  p.id,
  'completed',
  'medium',
  CURRENT_DATE - INTERVAL '2 days',
  100,
  ARRAY['MCA', 'Address Change', 'INC-22']
FROM companies c, profiles p
WHERE c.name = 'Acme Corporation Ltd.'
LIMIT 1;
