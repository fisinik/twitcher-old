import Image from "next/image";
import Button from "../button";
import { useAuth } from "../hooks/useAuth";
import { Session } from "next-auth";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

export const UserProfile = ({
  isVisible,
  onClose,
  session,
  userSightings,
}: ModalProps) => {
  const { signOut } = useAuth();
  const { user } = session;

  return (
    <AnimatePresence>
      {isVisible && (
        <Dialog
          open={isVisible}
          onClose={onClose}
          as="div"
          className="fixed inset-0 z-20 flex items-center justify-center overflow-y-auto"
        >
          <div className="flex w-[500px] flex-col py-8 px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <motion.div
              className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
              initial={{
                opacity: 0,
                scale: 0.75,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  ease: "easeOut",
                  duration: 0.25,
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.75,
                transition: {
                  ease: "easeIn",
                  duration: 0.15,
                },
              }}
            >
              <span
                className="hidden sm:inline-block sm:h-screen sm:align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div
                className="inline-block transform overflow-hidden rounded-lg bg-gray-50 text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="flex flex-col gap-y-10 p-10 md:px-14">
                  <div className="flex items-center gap-x-8 pb-4">
                    {user?.image ? (
                      <Link href={`/user-sightings/${user.id}`}>
                        <Image
                          src={user.image}
                          alt="user profile image"
                          width={80}
                          height={80}
                          className="rounded-full border border-teal-400"
                        />
                      </Link>
                    ) : (
                      <div className="relative h-[80px] w-[80px] rounded-full border border-teal-400" />
                    )}
                    <div className="flex flex-col gap-y-2">
                      <Link href={`/user-sightings/${user?.id}`}>
                        <h1 className="text-[25px] font-light leading-6 text-gray-900">
                          {user?.name}
                        </h1>
                      </Link>
                      <Link href={`/user-sightings/${user?.id}`}>
                        <h1 className="text-[13px] font-normal leading-4 text-gray-600">
                          {userSightings} sightings
                        </h1>
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-4">
                    <h1 className="text-[12px] font-normal leading-3 text-gray-600">
                      Name
                    </h1>
                    {user?.name ? (
                      <h1 className="text-[18px] font-normal leading-4 text-gray-900">
                        {user.name}
                      </h1>
                    ) : (
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-y-4">
                    <h1 className="text-[12px] font-normal leading-3 text-gray-600">
                      Email Address
                    </h1>
                    {user?.email ? (
                      <h1 className="text-[18px] font-normal leading-4 text-gray-900">
                        {user.email}
                      </h1>
                    ) : (
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-300" />
                    )}
                  </div>
                  <Button
                    className="w-1/2 self-center md:w-1/3"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  session: Session;
  userSightings: string;
}
