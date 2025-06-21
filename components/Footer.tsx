import { Minth_address, Minth_address_lisk } from "@/utils/var";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-gray-800/50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text">
                MINTH
              </h1>
            </Link>
            <p className="text-gray-400 mb-4">
              Create, mint, and trade unique NFTs with our intuitive platform.
            </p>
            <div className="flex space-x-4">
              <SocialIcon href="#" icon="twitter" />
              <SocialIcon href="#" icon="discord" />
              <SocialIcon href="#" icon="github" />
              <SocialIcon href="#" icon="telegram" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/" label="Home" />
              <FooterLink href="/#features" label="Features" />
              <FooterLink href="/#how-it-works" label="How It Works" />
              <FooterLink href="/gallery" label="Gallery" />
              <FooterLink href="/#contact" label="Contact" />
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink href="#" label="Documentation" />
              <FooterLink href="#" label="Tutorials" />
              <FooterLink href="#" label="FAQs" />
              <FooterLink href="#" label="Support" />
              <FooterLink href="#" label="Terms of Service" />
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Smart Contract</h3>
            <Link
              href={`https://celo.blockscout.com/address/${Minth_address}?tab=contract`}
              target="_blank"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors break-all"
            >
              Celo:{" "}
              {Minth_address.replace(
                Minth_address.slice(3, Minth_address.length - 3),
                "..."
              )}
            </Link>
            <Link
              href={`https://sepolia-blockscout.lisk.com/address/${Minth_address_lisk}?tab=contract`}
              target="_blank"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors break-all"
            >
              Lisk Sepolia:{" "}
              {Minth_address_lisk.replace(
                Minth_address_lisk.slice(3, Minth_address_lisk.length - 3),
                "..."
              )}
            </Link>

            <p className="text-gray-400 mt-4 text-sm">
              Deployed on Celo and Lisk Sepolia Testnet. View the contract
              details and transactions.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800/50 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Minth. All rights reserved. Created by{" "}
            <Link
              target="mazi"
              href="https://somtochukwu-k.vercel.app/"
              className="text-cyan-400 hover:text-cyan-300"
            >
              Somtochukwu
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// Footer Link Component
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-400 hover:text-cyan-400 transition-colors"
      >
        {label}
      </Link>
    </li>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: string }) {
  let iconSvg;

  switch (icon) {
    case "twitter":
      iconSvg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      );
      break;
    case "discord":
      iconSvg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
        </svg>
      );
      break;
    case "github":
      iconSvg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
      break;
    case "telegram":
      iconSvg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M9.417 15.181l-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218l-10.226 9.183z" />
        </svg>
      );
      break;
    default:
      iconSvg = null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-cyan-400 transition-colors"
    >
      {iconSvg}
    </a>
  );
}
