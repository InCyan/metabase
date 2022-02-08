import { User } from "metabase-types/api";

export const createMockUser = ({
  id = 1,
  first_name = "Testy",
  last_name = "Tableton",
  common_name = `${first_name} ${last_name}`,
  email = "user@metabase.test",
  google_auth = false,
  is_active = true,
  is_qbnewb = false,
  is_superuser = false,
  has_invited_second_user = false,
  personal_collection_id = 1,
  date_joined = new Date().toISOString(),
  last_login = new Date().toISOString(),
}: Partial<User> = {}): User => ({
  id,
  common_name,
  first_name,
  last_name,
  email,
  google_auth,
  is_active,
  is_qbnewb,
  is_superuser,
  has_invited_second_user,
  personal_collection_id,
  date_joined,
  last_login,
});
