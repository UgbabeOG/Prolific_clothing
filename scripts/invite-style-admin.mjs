import nextEnv from '@next/env';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2];

if (!url || !secretKey || !email) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local, then pass the admin email.');
  process.exit(2);
}

async function authRequest(path, method, body) {
  let response;
  try {
    response = await fetch(new URL(path, url), {
      method,
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Network request failed.';
    throw new Error(`Could not reach Supabase Auth: ${reason}`);
  }

  const responseBody = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = responseBody.msg || responseBody.message || responseBody.error_description || responseBody.error;
    throw new Error(typeof message === 'string' ? message : `Supabase Auth returned HTTP ${response.status}.`);
  }
  return responseBody;
}

let user;
try {
  user = await authRequest('/auth/v1/invite', 'POST', { email });
} catch (error) {
  console.error(`Could not invite the Style Library administrator: ${error instanceof Error ? error.message : 'Supabase Auth request failed.'}`);
  process.exit(1);
}

if (typeof user.id !== 'string' || !user.app_metadata || typeof user.app_metadata !== 'object') {
  console.error('Supabase Auth created an invitation but returned an unexpected user record; verify the account in the dashboard before retrying.');
  process.exit(1);
}

try {
  await authRequest(`/auth/v1/admin/users/${encodeURIComponent(user.id)}`, 'PUT', {
    app_metadata: {
      ...user.app_metadata,
      role: 'style_admin',
    },
  });
} catch (error) {
  let cleanupError;
  try {
    await authRequest(`/auth/v1/admin/users/${encodeURIComponent(user.id)}`, 'DELETE');
  } catch (caught) {
    cleanupError = caught;
  }
  console.error(`The invitation was sent, but the administrator role could not be assigned: ${error instanceof Error ? error.message : 'Supabase Auth request failed.'}`);
  if (cleanupError) {
    console.error(`Could not revoke the incomplete invitation: ${cleanupError instanceof Error ? cleanupError.message : 'Supabase Auth request failed.'}`);
  } else {
    console.error('The incomplete invited account was removed. Resolve the role assignment issue before retrying.');
  }
  process.exit(1);
}

console.log('Style Library admin invitation sent and the style_admin app role assigned.');
