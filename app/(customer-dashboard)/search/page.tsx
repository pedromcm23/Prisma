import { auth } from "@/auth";
import { getProperties } from "@/app/actions/property";
import { SAMPLE_LISTINGS } from "@/lib/prisma-types";
import { SearchClient } from "./search-client";

export default async function GuestPortal() {
  const session = await auth();
  
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
      user={session?.user || null} 
    />
  );
}
