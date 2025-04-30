import { useState } from 'react';
import { MdSearch, MdFilterList, MdLocationOn, MdFactory, MdOutlineEmail, MdOutlinePhone, MdOutlineMoreHoriz, MdOutlineLink, MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import { FaLinkedin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FacilityDirectory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);

  // Facility data matching the image
  const facilities = [
    {
      id: 1,
      name: "Jeff Levy",
      jobTitle: "Facilities Manager",
      company: "Apple",
      companyLogo: "apple",
      email: true,
      mobile: true,
      location: "Atlanta, GA"
    },
    {
      id: 2,
      name: "Amy Huke",
      jobTitle: "Facilities Manager",
      company: "Honeywell",
      companyLogo: "honeywell",
      email: true,
      mobile: true,
      location: "Kansas City, MO"
    },
    {
      id: 3,
      name: "Ryan Kuddes",
      jobTitle: "Facilities Manager",
      company: "Apple",
      companyLogo: "apple",
      email: true,
      mobile: true,
      location: "Denver, CO"
    },
    {
      id: 4,
      name: "Zuretti Carter",
      jobTitle: "Facilities Manager",
      company: "ChargePoint",
      companyLogo: "chargepoint",
      email: true,
      mobile: true,
      location: "San Francisco, CA"
    },
    {
      id: 5,
      name: "Scott Simpson",
      jobTitle: "Facilities Manager",
      company: "Plexus Corp.",
      companyLogo: "plexus",
      email: true,
      mobile: true,
      location: "Neenah, WI"
    },
    {
      id: 6,
      name: "Rob Greinke",
      jobTitle: "Facilities Manager",
      company: "Eaton",
      companyLogo: "eaton",
      email: true,
      mobile: true,
      location: "Waukesha, WI"
    },
    {
      id: 7,
      name: "Ryan Frey",
      jobTitle: "Facilities Manager",
      company: "Vertiv",
      companyLogo: "vertiv",
      email: true,
      mobile: true,
      location: "Delaware, OH"
    },
    {
      id: 8,
      name: "Fred Hotchkiss",
      jobTitle: "Facilities Manager",
      company: "EMS Technologies, Inc.",
      companyLogo: "ems",
      email: true,
      mobile: true,
      location: "Binghamton, NY"
    },
    {
      id: 9,
      name: "Anthony Sankale",
      jobTitle: "Facilities Manager",
      company: "Novanta Inc.",
      companyLogo: "novanta",
      email: true,
      mobile: true,
      location: "Boston, MA"
    },
    {
      id: 10,
      name: "Bob Harrison",
      jobTitle: "Facilities Manager",
      company: "Franklin Electric",
      companyLogo: "franklin",
      email: true,
      mobile: true,
      location: "Bluffton, IN"
    },
    {
      id: 11,
      name: "Matt Olson",
      jobTitle: "Facilities Manager",
      company: "Bentek Corporation",
      companyLogo: "bentek",
      email: true,
      mobile: true,
      location: "San Jose, CA"
    },
    {
      id: 12,
      name: "Bradley Romero",
      jobTitle: "Facilities Manager",
      company: "Honeywell",
      companyLogo: "honeywell",
      email: true,
      mobile: true,
      location: "Denver, CO"
    },
    {
      id: 13,
      name: "Vicente Cornejo",
      jobTitle: "Facilities Manager",
      company: "ITW Food Equipment Group",
      companyLogo: "itw",
      email: true,
      mobile: true,
      location: "Dayton, OH"
    },
    {
      id: 14,
      name: "Daniel Conroy",
      jobTitle: "Facilities Manager",
      company: "Apple",
      companyLogo: "apple",
      email: true,
      mobile: true,
      location: "Jersey City, NJ"
    }
  ];

  // Filter facilities based on search term
  const filteredFacilities = facilities.filter(facility => 
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats for the top summary
  const stats = {
    total: 335,
    netNew: 335,
    saved: 0
  };

  // Company logo component
  const CompanyLogo = ({ company }: { company: string }) => {
    switch (company.toLowerCase()) {
      case 'apple':
        return <div className="flex items-center justify-center w-6 h-6"><span className="text-black dark:text-white">🍎</span></div>;
      case 'honeywell':
        return <div className="flex items-center justify-center w-6 h-6 bg-red-600 rounded-sm"></div>;
      case 'chargepoint':
        return <div className="flex items-center justify-center w-6 h-6 text-gray-500">—</div>;
      case 'plexus corp.':
        return <div className="flex items-center justify-center w-6 h-6 bg-red-700 rounded-sm"></div>;
      case 'eaton':
        return <div className="flex items-center justify-center w-6 h-6 text-blue-500">E</div>;
      case 'vertiv':
        return <div className="flex items-center justify-center w-6 h-6 bg-black rounded-sm"></div>;
      case 'ems technologies, inc.':
        return <div className="flex items-center justify-center w-6 h-6 text-red-500">E</div>;
      case 'novanta inc.':
        return <div className="flex items-center justify-center w-6 h-6 bg-teal-500 rounded-full"></div>;
      case 'franklin electric':
        return <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full"></div>;
      case 'bentek corporation':
        return <div className="flex items-center justify-center w-6 h-6 text-blue-400">B</div>;
      case 'itw food equipment group':
        return <div className="flex items-center justify-center w-6 h-6 text-gray-500">I</div>;
      default:
        return <div className="flex items-center justify-center w-6 h-6 bg-gray-300 rounded-sm"></div>;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-5">
        <div className="box">
          {/* Stats Summary */}
          <div className="mb-6 border rounded-md overflow-hidden">
            <div className="flex border-b">
              <div className="flex-1 py-2 px-4 text-center font-medium border-r">
                Total
              </div>
              <div className="flex-1 py-2 px-4 text-center font-medium border-r">
                Net New
              </div>
              <div className="flex-1 py-2 px-4 text-center font-medium">
                Saved
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 py-3 px-4 text-center border-r">
                {stats.total}
              </div>
              <div className="flex-1 py-3 px-4 text-center border-r">
                {stats.netNew}
              </div>
              <div className="flex-1 py-3 px-4 text-center">
                {stats.saved}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search facilities, managers, or locations..."
                    className="w-full p-2 pl-10 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <MdSearch className="absolute left-3 top-2.5 text-gray-500 text-xl" />
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="flex items-center gap-1 px-3 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <MdFilterList /> Filters
                </button>
                <button className="px-3 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  Lists <span className="text-xs">▼</span>
                </button>
                <button className="px-3 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  Persona <span className="text-xs">▼</span>
                </button>
              </div>
            </div>

            {filterOpen && (
              <div className="mt-4 p-4 border rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Email Status</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 border rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                    </div>
                    <span>Verified</span>
                    <span className="text-xs text-gray-500">×</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Job Titles</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 border rounded"></div>
                    <span>Include:</span>
                    <span className="bg-gray-100 text-xs px-2 py-0.5 rounded">facilities manager</span>
                    <span className="text-xs text-gray-500">×</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Company</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 border rounded"></div>
                    <span>All companies</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Location</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 border rounded"></div>
                    <span>Person Locations:</span>
                    <span className="bg-gray-100 text-xs px-2 py-0.5 rounded">United States</span>
                    <span className="text-xs text-gray-500">×</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Employees</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 border rounded"></div>
                    <span>All employees</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Industry & Keywords</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 border rounded"></div>
                    <span>Industry:</span>
                    <span className="bg-gray-100 text-xs px-2 py-0.5 rounded">electrical/electronic manufacturing</span>
                    <span className="text-xs text-gray-500">×</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Facilities Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3 w-10">
                    <input type="checkbox" className="w-4 h-4" />
                  </th>
                  <th className="p-3 font-medium text-gray-600">NAME</th>
                  <th className="p-3 font-medium text-gray-600">JOB TITLE</th>
                  <th className="p-3 font-medium text-gray-600">COMPANY</th>
                  <th className="p-3 font-medium text-gray-600">EMAILS</th>
                  <th className="p-3 font-medium text-gray-600">PHONE NUMBERS</th>
                  <th className="p-3 font-medium text-gray-600">ACTIONS</th>
                  <th className="p-3 font-medium text-gray-600">LINKS</th>
                  <th className="p-3 font-medium text-gray-600">LOCATION</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.map((facility) => (
                  <tr 
                    key={facility.id} 
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setSelectedFacility(facility.id === selectedFacility ? null : facility.id)}
                  >
                    <td className="p-3">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                    <td className="p-3">
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        {facility.name}
                      </a>
                    </td>
                    <td className="p-3">{facility.jobTitle}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <CompanyLogo company={facility.company} />
                        <span>{facility.company}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <button className="bg-green-50 text-green-600 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                        <MdOutlineEmail className="text-green-500" /> Access email
                      </button>
                    </td>
                    <td className="p-3">
                      <button className="bg-gray-50 text-gray-600 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                        <MdOutlinePhone className="text-gray-500" /> Access Mobile
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-500 hover:text-gray-700">
                          <MdArrowUpward />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                          <MdArrowDownward />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                          <MdOutlineLink />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                          <MdOutlineMoreHoriz />
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      <a href="#" className="text-blue-600">
                        <FaLinkedin />
                      </a>
                    </td>
                    <td className="p-3">{facility.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredFacilities.length} of {facilities.length} facilities
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-1 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                2
              </button>
              <button className="px-3 py-1 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                3
              </button>
              <button className="px-3 py-1 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDirectory; 