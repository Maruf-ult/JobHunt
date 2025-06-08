import PropTypes from "prop-types";

function JobFilters({ setSelectedCategory }) {
  return (
    <div className="w-44 p-4 bg-zinc-50 rounded-md shadow-md">
      <h2 className="font-bold text-lg">Filter Jobs</h2>

      {/* Location Filter */}
      <div className="mt-2">
        <h3 className="font-semibold">Location</h3>
        <label className="block">
          <input type="radio" name="filter" onChange={() => setSelectedCategory("Dhaka")} />
          Dhaka
        </label>
        <label className="block">
          <input type="radio" name="filter" onChange={() => setSelectedCategory("Chittagong")} />
          Chittagong
        </label>
        <label className="block">
          <input type="radio" name="filter" onChange={() => setSelectedCategory("usa")} />
          America
        </label>
      </div>

      {/* Position Filter */}
      <div className="mt-2">
        <h3 className="font-semibold">Position</h3>
        <label className="block">
          <input type="radio" name="filter" onChange={() => setSelectedCategory("Software Engineer")} />
          Software Engineer
        </label>
        <label className="block">
          <input type="radio" name="filter" onChange={() => setSelectedCategory("Frontend Developer")} />
          Frontend Developer
        </label>
        <label className="block">
          <input type="radio" name="filter" onChange={() => setSelectedCategory("Backend Developer")} />
          Backend Developer
        </label>
      </div>

      {/* Salary Filter */}
      <div className="mt-2">
        <h3 className="font-semibold">Salary</h3>
        <label className="block">
          <input type="radio" name="filter" onChange={() => setSelectedCategory("Low")} />
          Below 50k
        </label>
        <label className="block">
          <input type="radio" name="filter" onChange={() => setSelectedCategory("High")} />
          Above 50k
        </label>
      </div>

      {/* Clear Filter */}
      <div className="mt-4">
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={() => window.location.reload()}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

// PropTypes validation
JobFilters.propTypes = {
  setSelectedCategory: PropTypes.func.isRequired,
};

export default JobFilters;
