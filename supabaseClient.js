// supabaseClient.js — Conexión con Supabase

const SUPABASE_URL = 'https://qrdeqzwgcfvbfddzorwj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZGVxendnY2Z2ZmJkZHpvcndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5OTU3NTgsImV4cCI6MjEwNzU3MTc1OH0.RgOVtNhA_KvISbL4OtTruJ8qEE8cglkb4O82OPpgz1M';

// Inicializar cliente global
const { createClient } = supabase;
window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
