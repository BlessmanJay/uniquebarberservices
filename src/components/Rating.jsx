import { StarIcon } from "@heroicons/react/24/outline";

function Rating() {
  return (
    <div className="mt-2 mb-8 grid grid-cols-3 place-items-center md:mx-5 mx-auto gap-6 max-w-2xl md:max-w-2xs font-body">
      <div className="">
        <div className="font-extrabold text-gray-600 flex ml-3">
          <span className="text-lg">4</span>
          <span className="-translate-y-1 text-lg">.8</span>
        </div>
        <p className="uppercase text-gray-400 font-semibold text-sm">rating</p>
      </div>

      <div>
        <div className="font-extrabold text-gray-600">
          <span className="text-center ml-4 text-lg">30</span>
        </div>
        <p className="uppercase text-gray-400 font-semibold text-sm">reviews</p>
      </div>

      <div className="font-extrabold text-xl text-gray-600 flex">
        <StarIcon className="text-amber-600 w-5 h-5 fill-amber-600" />
        <StarIcon className="text-amber-600 w-5 h-5 fill-amber-600" />
        <StarIcon className="text-amber-600 w-5 h-5 fill-amber-600" />
        <StarIcon className="text-amber-600 w-5 h-5 fill-amber-600" />
        <StarIcon className="text-gray-300 w-5 h-5 fill-gray-200" />
      </div>
    </div>
  );
}

export default Rating;
