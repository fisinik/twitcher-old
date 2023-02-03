import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Logo } from "./logo";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { UserProfile } from "./user-profile";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const { session, signIn } = useAuth();
  // lock scrolling when menu is open
  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isMenuOpen);
  }, [isMenuOpen]);

  return (
    <>
      <header className={`${isMenuOpen ? 'bg-gradient-to-l from-teal-500 to-neutral-50 shadow' : 'bg-neutral-50'} fixed w-full z-50 h-[80px] shadow-2xl flex items-center justify-between pr-4 md:px-8 xl:from-neutral-50`}>
        <div className="flex items-center">
          <Logo />
          <Link className="text-4xl font-bold text-gray-800 font-ubuntu"
            href="/" onClick={() => isMenuOpen && setIsMenuOpen(false)}>
            Tw <span className={`-mx-2 ${isMenuOpen ? 'text-gray-800 opacity-100' : 'text-teal-400 opacity-80'} xl:text-teal-400 xl:opacity-80`}> itch </span> er
          </Link>
        </div>
        <nav className="">
          <label className={`${styles.hamburger} mt-1`}>
            <input className="xl:hidden" type="checkbox" checked={!isMenuOpen} onChange={() => setIsMenuOpen(!isMenuOpen)} />
            <div>
              <span></span>
              <span></span>
            </div>
          </label>
          <ul
            className={`${isMenuOpen ? styles.menuOpen : styles.menuClose} z-50 font-ubuntu w-screen fixed overflow-hidden top-[80px] right-0 bottom-0 flex flex-col items-center
            justify-center
            xl:opacity-100 xl:flex-row xl:bg-neutral-50 xl:static xl:w-auto xl:space-x-16 xl:font-normal xl:text-xl xl:pr-10
            `}>
            <Link className={`${styles.menuItem} hover:bg-gradient-to-l from-neutral-50 hover:text-gray-800 xl:bg-neutral-50 xl:hover:text-2xl xl:hover:text-gray-900`}
              href="/" onClick={() => { isMenuOpen && setIsMenuOpen(false); isUserProfileOpen && setIsUserProfileOpen(false) }}
            >Home</Link>
            <Link className={`${styles.menuItem} hover:bg-gradient-to-l from-neutral-50 hover:text-gray-800 xl:bg-neutral-50 xl:hover:text-2xl xl:hover:text-gray-900`}
              href="/sightings" onClick={() => { isMenuOpen && setIsMenuOpen(false); isUserProfileOpen && setIsUserProfileOpen(false) }}
            >Sightings</Link>
            {session && session.user && session.user.image ? (
              <li className={`${styles.menuItem} hover:bg-gradient-to-l from-neutral-50 hover:text-gray-800 xl:bg-neutral-50 xl:hover:text-2xl xl:hover:text-gray-900 cursor-pointer flex items-center justify-center py-6 xl:py-0`}
                onClick={() => { setIsUserProfileOpen(!isUserProfileOpen); isMenuOpen && setIsMenuOpen(false) }}>
                <span
                  className="h-24 w-24 xl:h-14 xl:w-14 bg-cover bg-center rounded-full inline-block border border-teal-400"
                  style={{ backgroundImage: `url(${session.user.image})` }}
                >
                </span>
              </li>
            ) : (
              <li className={`${styles.menuItem} hover:bg-gradient-to-l from-neutral-50 hover:text-gray-800 xl:bg-neutral-50 xl:hover:text-2xl xl:hover:text-gray-900 cursor-pointer`}>
                <span
                  className="cursor-pointer"
                  onClick={() => signIn()}
                >
                  Log in
                </span>
              </li>)}
          </ul>
        </nav>
      </header >
      {session && session.user && (
        <UserProfile
          isVisible={isUserProfileOpen}
          onClose={() => setIsUserProfileOpen(false)}
          session={session}
        />
      )}
    </>
  )
}
