-- Allow the server-only owner action to delete marketplace listings.
-- The service-role key must remain server-side; owner session/username checks
-- are enforced in app/components/owner-actions.js before this query runs.
grant select, delete on table public.listings to service_role;
