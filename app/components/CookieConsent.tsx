"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    
    setIsMounted(true);
    
   
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
     
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
   
    console.log("Cookies accepted - analytics enabled");
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
   
    console.log("Cookies declined - analytics disabled");
  };

  
  if (!isMounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0  z-50 p-4 md:p-6"
        >
          <div className="max-w-xl mx-auto bg-white/95 backdrop-blur-lg rounded-sm shadow-2xl border border-gray-200 p-6 md:p-8 ">
            <div className="flex flex-col md:flex-col items-start md:items-end justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🍪 We use cookies
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed sub">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  By clicking "Accept", you consent to our use of cookies.{" "}
                  <a 
                    href="/privacy" 
                    className="text-black underline hover:text-gray-700 transition-colors"
                  >
                    Learn more
                  </a>
                </p>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={declineCookies}
                  className="cursor-pointer sub flex-1 md:flex-none px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={acceptCookies}
                  className=" cursor-pointer sub flex-1 md:flex-none px-6 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-sm transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
