import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Logo } from "./logo";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { UserProfile } from "./user-profile";
import { trpc } from "../../utils/trpc";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const { session, signIn } = useAuth();
  // lock scrolling when menu is open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMenuOpen);
  }, [isMenuOpen]);

  const { data: userSightings } = trpc.sighting.getUserSightings.useQuery(
    { id: session?.user?.id as string },
    {
      enabled: !!session,
    }
  );
  return (
    <>
      <header
        className={`${
          isMenuOpen
            ? "bg-gradient-to-l from-teal-500 to-neutral-50 shadow"
            : "bg-neutral-50"
        } fixed z-50 flex h-[80px] w-full items-center justify-between pr-4 shadow-2xl md:px-8 xl:from-neutral-50`}
      >
        <div className="flex items-center">
          <Logo />
          <Link
            className="font-ubuntu text-4xl font-bold text-gray-800"
            href="/"
            onClick={() => {
              isMenuOpen && setIsMenuOpen(false);
              isUserProfileOpen && setIsUserProfileOpen(false);
            }}
          >
            Tw
            <span
              className={`${
                isMenuOpen
                  ? "text-gray-800 opacity-100"
                  : "text-teal-400 opacity-80"
              } xl:text-teal-400 xl:opacity-80`}
            >
              itch
            </span>
            er
          </Link>
        </div>
        <nav className="">
          <label className={`${styles.hamburger} mt-1`}>
            <input
              className="xl:hidden"
              type="checkbox"
              checked={!isMenuOpen}
              onChange={() => setIsMenuOpen(!isMenuOpen)}
            />
            <div>
              <span></span>
              <span></span>
            </div>
          </label>
          <ul
            className={`${
              isMenuOpen ? styles.menuOpen : styles.menuClose
            } font-ubuntu fixed top-[80px] right-0 bottom-0 z-50 flex w-screen flex-col items-center justify-center
            overflow-hidden
            xl:static xl:w-auto xl:flex-row xl:space-x-16 xl:bg-neutral-50 xl:pr-10 xl:text-xl xl:font-normal xl:opacity-100
            `}
          >
            <Link
              className={`${styles.menuItem} from-neutral-50 hover:bg-gradient-to-l hover:text-gray-800 xl:bg-neutral-50 xl:hover:text-2xl xl:hover:text-gray-900`}
              href="/"
              onClick={() => {
                isMenuOpen && setIsMenuOpen(false);
                isUserProfileOpen && setIsUserProfileOpen(false);
              }}
            >
              Home
            </Link>
            <Link
              className={`${styles.menuItem} from-neutral-50 hover:bg-gradient-to-l hover:text-gray-800 xl:bg-neutral-50 xl:hover:text-2xl xl:hover:text-gray-900`}
              href="/sightings"
              onClick={() => {
                isMenuOpen && setIsMenuOpen(false);
                isUserProfileOpen && setIsUserProfileOpen(false);
              }}
            >
              Sightings
            </Link>
            {session && session.user && session.user.image ? (
              <li
                className={`${styles.menuItem} flex cursor-pointer items-center justify-center from-neutral-50 py-6 hover:bg-gradient-to-l hover:text-gray-800 xl:bg-neutral-50 xl:py-0 xl:hover:text-2xl xl:hover:text-gray-900`}
                onClick={() => {
                  setIsUserProfileOpen(!isUserProfileOpen);
                  isMenuOpen && setIsMenuOpen(false);
                }}
              >
                <span
                  className="inline-block h-20 w-20 rounded-full border border-teal-400 bg-cover bg-center xl:h-12 xl:w-12"
                  style={{ backgroundImage: `url(${session.user.image})` }}
                ></span>
              </li>
            ) : (
              <li
                className={`${styles.menuItem} cursor-pointer from-neutral-50 hover:bg-gradient-to-l hover:text-gray-800 xl:bg-neutral-50 xl:hover:text-2xl xl:hover:text-gray-900`}
              >
                <span className="cursor-pointer" onClick={() => signIn()}>
                  Log in
                </span>
              </li>
            )}
          </ul>
        </nav>
      </header>
      {session && session.user && (
        <UserProfile
          isVisible={isUserProfileOpen}
          onClose={() => setIsUserProfileOpen(false)}
          session={session}
          userSightings={userSightings?.length?.toString() as string}
        />
      )}
    </>
  );
}
