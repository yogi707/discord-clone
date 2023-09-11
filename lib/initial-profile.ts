import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  try {
    const user = await currentUser();

    console.log({ user });

    if (!user) return redirectToSignIn();

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
    });

    console.log({ profile });

    if (profile) return profile;

    const newProfile = await db.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newProfile;
  } catch (err) {
    console.log("inital-page", err);
  }
};
