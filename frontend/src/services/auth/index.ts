import { supabase } from "../../lib/supabase";
import { FieldType } from "../../types/login";


export const authenticateUser = async (credentials: FieldType) => {
    const {userName, password} = credentials;
    return await supabase.auth.signInWithPassword({
        email: userName,
        password
    });
}

export const logoutUser = async () => {
    return await supabase.auth.signOut();
}

export const getUserName = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error);
    return null;
  }

  return data.session?.user?.email ?? null;
};
