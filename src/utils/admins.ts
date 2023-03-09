export const admins = ["kwansing14@gmail.com", "carolinepua@hotmail.com"];

type SessionProp = {
  user: {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  } | null;
} | null;

export const isAdmin = (session: SessionProp) => {
  if (session?.user?.email) {
    return admins.includes(session.user.email);
  }
  return false;
};
