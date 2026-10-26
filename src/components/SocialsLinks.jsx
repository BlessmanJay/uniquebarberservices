import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { SiX } from "@icons-pack/react-simple-icons";

function SocialsLinks() {
  return (
    <div className="mt-8 mb-8 flex flex-wrap items-center gap-3 text-2xl sm:gap-4">
      <a
        href="https://facebook.com/UniqueBarbershopAKS"
        aria-label="Facebook"
        target="_blank"
        rel="noreferrer"
        className="border border-slate-500 p-2 rounded-full"
      >
        <FaFacebook />
      </a>
      <a
        href="https://instagram.com"
        aria-label="Instagram"
        target="_blank"
        rel="noreferrer"
        className="border border-slate-500 p-2 rounded-full"
      >
        <FaInstagram />
      </a>

      <a
        href="https://tiktok.com"
        aria-label="Tiktok"
        target="_blank"
        rel="noreferrer"
        className="border border-slate-500 p-2 rounded-full"
      >
        <FaTiktok />
      </a>

      <a
        href="https://wa.me/2349057908212"
        aria-label="WhatsApp"
        target="_blank"
        rel="noreferrer"
        className="border border-slate-500 p-2 rounded-full"
      >
        <FaWhatsapp />
      </a>

      <a
        href="https://x.com"
        aria-label="X"
        target="_blank"
        rel="noreferrer"
        className="border border-slate-500 p-2 rounded-full"
      >
        <SiX />
      </a>

      <a
        href="https://youtube.com"
        aria-label="YouTube"
        target="_blank"
        rel="noreferrer"
        className="border border-slate-500 p-2 rounded-full"
      >
        <FaYoutube />
      </a>
    </div>
  );
}

export default SocialsLinks;
