import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getProperties } from "@/app/actions/property";
import { SAMPLE_LISTINGS } from "@/lib/prisma-types";
import { SearchClient } from "./search-client";

export default async function GuestPortal() {
  const session = await auth();
  
  let role = "GUEST";
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });
    if (dbUser) role = dbUser.role;
  }
  
  let dbListings = SAMPLE_LISTINGS;
  try {
    const props = await getProperties();
    if (props && props.length > 0) {
      dbListings = props;
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <SearchClient 
      initialListings={dbListings} 
      user={session?.user ? { ...session.user, role } : null} 
    />
  );
}
