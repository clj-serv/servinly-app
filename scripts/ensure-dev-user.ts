import { createClient } from '@supabase/supabase-js';

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const EMAIL = 'dev.user@example.com';
const PASSWORD = 'ChangeMe123!';

async function main() {
  const { data: { users } } = await supa.auth.admin.listUsers({ page: 1, perPage: 200 });
  let user = users.find(u => u.email === EMAIL);

  if (!user) {
    user = (await supa.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
    })).data!.user!;
  }

  await supa.from('profiles').upsert({ id: user.id, email: EMAIL });
  console.log('DEV_USER_ID=', user.id);
}

main();
