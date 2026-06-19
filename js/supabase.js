/**
 * Supabase connection and database queries
 */

let supabaseClient = null;

// Initialize Supabase connection
async function initSupabase() {
  const SUPABASE_URL = 'https://your-project.supabase.co'; // Replace with your URL
  const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Replace with your key

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Supabase credentials not found. Please update SUPABASE_URL and SUPABASE_ANON_KEY in js/supabase.js');
    return null;
  }

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

// Get all groups
async function getGrupos() {
  const { data, error } = await supabaseClient
    .from('grupos')
    .select('*')
    .order('grupo');

  if (error) console.error('Error fetching grupos:', error);
  return data || [];
}

// Get countries for a group
async function getPaisesByGrupo(grupo) {
  const { data, error } = await supabaseClient
    .from('paises')
    .select('*')
    .eq('grupo', grupo)
    .order('nome');

  if (error) console.error('Error fetching paises:', error);
  return data || [];
}

// Get stickers for a country
async function getFigurinhasByPais(paisSigla) {
  const { data, error } = await supabaseClient
    .from('figurinhas')
    .select('*')
    .eq('pais_sigla', paisSigla)
    .order('codigo');

  if (error) console.error('Error fetching figurinhas:', error);
  return data || [];
}

// Update sticker status (has/not has)
async function toggleFigurinha(codigo) {
  // Get current status
  const { data: figurinha, error: fetchError } = await supabaseClient
    .from('figurinhas')
    .select('tem')
    .eq('codigo', codigo)
    .single();

  if (fetchError) {
    console.error('Error fetching figurinha:', fetchError);
    return null;
  }

  // Toggle
  const newStatus = !figurinha.tem;
  const { error: updateError } = await supabaseClient
    .from('figurinhas')
    .update({ tem: newStatus, updated_at: new Date().toISOString() })
    .eq('codigo', codigo);

  if (updateError) {
    console.error('Error updating figurinha:', updateError);
    return null;
  }

  return newStatus;
}

// Add duplicate
async function addDuplicata(codigo) {
  const { data: figurinha, error: fetchError } = await supabaseClient
    .from('figurinhas')
    .select('duplicatas')
    .eq('codigo', codigo)
    .single();

  if (fetchError) {
    console.error('Error fetching figurinha:', fetchError);
    return null;
  }

  const newCount = (figurinha.duplicatas || 0) + 1;
  const { error: updateError } = await supabaseClient
    .from('figurinhas')
    .update({ duplicatas: newCount, updated_at: new Date().toISOString() })
    .eq('codigo', codigo);

  if (updateError) {
    console.error('Error updating duplicatas:', updateError);
    return null;
  }

  return newCount;
}

// Remove duplicate
async function removeDuplicata(codigo) {
  const { data: figurinha, error: fetchError } = await supabaseClient
    .from('figurinhas')
    .select('duplicatas')
    .eq('codigo', codigo)
    .single();

  if (fetchError) {
    console.error('Error fetching figurinha:', fetchError);
    return null;
  }

  const newCount = Math.max(0, (figurinha.duplicatas || 1) - 1);
  const { error: updateError } = await supabaseClient
    .from('figurinhas')
    .update({ duplicatas: newCount, updated_at: new Date().toISOString() })
    .eq('codigo', codigo);

  if (updateError) {
    console.error('Error updating duplicatas:', updateError);
    return null;
  }

  return newCount;
}

// Get duplicates list
async function getFigurinhasComDuplicatas() {
  const { data, error } = await supabaseClient
    .from('figurinhas')
    .select('codigo, nome, pais_sigla, duplicatas')
    .gt('duplicatas', 0)
    .order('codigo');

  if (error) console.error('Error fetching duplicatas:', error);
  return data || [];
}

// Get statistics
async function getStatisticas() {
  // Total com figurinhas
  const { count: totalCom, error: errorCom } = await supabaseClient
    .from('figurinhas')
    .select('*', { count: 'exact' })
    .eq('tem', true);

  if (errorCom) console.error('Error counting:', errorCom);

  // Total geral
  const { count: totalGeral, error: errorGeral } = await supabaseClient
    .from('figurinhas')
    .select('*', { count: 'exact' });

  if (errorGeral) console.error('Error counting total:', errorGeral);

  return {
    coletadas: totalCom || 0,
    total: totalGeral || 0,
    percentual: totalGeral ? Math.round((totalCom || 0) / totalGeral * 100) : 0
  };
}

// Get statistics by group
async function getStatisticasByGrupo(grupo) {
  const { count: totalCom, error: errorCom } = await supabaseClient
    .from('figurinhas')
    .select('*', { count: 'exact' })
    .eq('grupo', grupo)
    .eq('tem', true);

  if (errorCom) console.error('Error counting by group:', errorCom);

  const { count: totalGeral, error: errorGeral } = await supabaseClient
    .from('figurinhas')
    .select('*', { count: 'exact' })
    .eq('grupo', grupo);

  if (errorGeral) console.error('Error counting group total:', errorGeral);

  return {
    coletadas: totalCom || 0,
    total: totalGeral || 0,
    percentual: totalGeral ? Math.round((totalCom || 0) / totalGeral * 100) : 0
  };
}

// Get statistics by country
async function getStatisticasByPais(paisSigla) {
  const { count: totalCom, error: errorCom } = await supabaseClient
    .from('figurinhas')
    .select('*', { count: 'exact' })
    .eq('pais_sigla', paisSigla)
    .eq('tem', true);

  if (errorCom) console.error('Error counting by pais:', errorCom);

  const { count: totalGeral, error: errorGeral } = await supabaseClient
    .from('figurinhas')
    .select('*', { count: 'exact' })
    .eq('pais_sigla', paisSigla);

  if (errorGeral) console.error('Error counting pais total:', errorGeral);

  return {
    coletadas: totalCom || 0,
    total: totalGeral || 0,
    percentual: totalGeral ? Math.round((totalCom || 0) / totalGeral * 100) : 0
  };
}
