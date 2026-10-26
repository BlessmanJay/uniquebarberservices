import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

function ContactsQuickLinks() {
  return (
    <div>
      <p className="uppercase text-lg text-slate-400 tracking-wide mb-6 md:mr-6">
        get in touch
      </p>
      <div className="mt-5 mb-5 flex items-start gap-4 sm:gap-6">
        <span>
          <MapPinIcon className="w-5 h-5" />
        </span>
        <p>Abak, Akwa Ibom State, Nigeria</p>
      </div>

      <div className="mt-5 mb-5 flex items-start gap-4 sm:gap-6">
        <span>
          <PhoneIcon className="w-5 h-5" />
        </span>
        <a href="tel:+2349057908212" className="text-blue-500 hover:underline">
          +2349057908212
        </a>
      </div>

      <div className="mt-5 mb-5 flex items-start gap-4 sm:gap-6">
        <span>
          <EnvelopeIcon className="w-5 h-5" />
        </span>
        <a
          href="mailto:uniquebarberservices247@gmail.com"
          className="break-all text-sm text-blue-500 hover:underline"
        >
          uniquebarberservices247@gmail.com
        </a>
      </div>
    </div>
  );
}

export default ContactsQuickLinks;
