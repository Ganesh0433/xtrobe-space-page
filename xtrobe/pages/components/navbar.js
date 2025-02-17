"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, Rocket, Users, Globe, Calendar, ChevronDown } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 z-50 flex">
      {/* Sidebar Container */}
      <motion.div
        animate={{ width: isOpen ? 250 : 60 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="bg-gray-900 text-white h-screen shadow-lg flex flex-col items-center"
      >
        {/* Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer p-4 hover:bg-gray-800 transition w-full flex items-center justify-start"
        >
          <Menu size={26} />
          {isOpen && <span className="ml-3 text-lg">Menu</span>}
        </button>

        {/* Navigation */}
        <motion.div
          className="mt-4 flex flex-col w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <NavItem href="/latestnews" label="Space News" Icon={Globe} isOpen={isOpen} />
          <NavItem href="/space" label="Space" Icon={Rocket} isOpen={isOpen} />
          <NavItem href="/community-hub" label="Community Hub" Icon={Users} isOpen={isOpen} />

          {/* Events Dropdown (toggle, not a redirect) */}
          <div className="w-full">
            <button
              onClick={() => setIsEventsOpen(!isEventsOpen)}
              className="cursor-pointer flex items-center justify-between p-4 rounded-lg w-full hover:bg-gray-800 transition"
            >
              <div className="flex items-center">
                <Calendar size={24} />
                {isOpen && <span className="ml-3">Events</span>}
              </div>
              {isOpen && (
                <motion.div animate={{ rotate: isEventsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={18} />
                </motion.div>
              )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isEventsOpen && isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-4 flex flex-col bg-gray-800 rounded-lg overflow-hidden mt-2"
                >
                  <DropdownItem href="/rocket" label="Rocket Events" />
                  <DropdownItem href="/astronomy" label="Astronomy Events" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Navigation Item: The entire container is wrapped with Link
const NavItem = ({ href, label, Icon, isOpen }) => (
  <Link href={href} className="w-full">
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="cursor-pointer flex items-center p-3 rounded-lg hover:bg-gray-800 transition w-full"
    >
      <Icon size={24} />
      {isOpen && (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3">
          {label}
        </motion.span>
      )}
    </motion.div>
  </Link>
);

// Dropdown Item: Wrap the whole item in Link so clicking anywhere redirects
const DropdownItem = ({ href, label }) => (
  <Link href={href} className="w-full">
    <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer p-3 hover:bg-blue-500 transition">
      {label}
    </motion.div>
  </Link>
);

export default Sidebar;
