
import PropTypes from 'prop-types';


function RecruiterForm({ formValues, handleInputChange,handleFileChange, handleSubmit }) {
  return (

<form
  onSubmit={handleSubmit}
  className="text-black bg-white border h-auto w-full max-w-[185vh] mt-3 mx-auto px-4 md:px-8 py-6 space-y-6"
>
  <h1 className="text-black underline font-light">Professional Information</h1>

  <div className="flex flex-wrap gap-6 pt-4">
    {/* First Name */}
    <div className="flex-1 min-w-[250px] space-y-1">
      <h3>*First Name</h3>
      <input
        name="firstName"
        className="w-full px-4 py-2 border border-black bg-slate-200 font-light"
        type="text"
        value={formValues.firstName || ""}
        onChange={handleInputChange}
      />
    </div>
    {/* Last Name */}
    <div className="flex-1 min-w-[250px] space-y-1">
      <h3>*Last Name</h3>
      <input
        name="lastName"
        className="w-full px-4 py-2 border border-black bg-slate-200 font-light"
        type="text"
        value={formValues.lastName || ""}
        onChange={handleInputChange}
      />
    </div>
    {/* Phone Number */}
    <div className="flex-1 min-w-[250px] space-y-1">
      <h3>*Phone Number</h3>
      <input
        name="phoneNumber"
        className="w-full px-4 py-2 border border-black bg-slate-200 font-light"
        type="text"
        value={formValues.phoneNumber || ""}
        onChange={handleInputChange}
      />
    </div>
  </div>

  <div className="flex flex-wrap gap-6 pt-2 pb-4">
    {/* LinkedIn */}
    <div className="flex-1 min-w-[250px] space-y-1">
      <h3>*LinkedIn Profile</h3>
      <input
        name="profile"
        className="w-full px-4 py-2 border border-black bg-slate-200 font-light"
        type="url"
        value={formValues.profile || ""}
        onChange={handleInputChange}
      />
    </div>
    {/* Address */}
    <div className="flex-1 min-w-[250px] space-y-1">
      <h3>*Address</h3>
      <input
        name="address"
        className="w-full px-4 py-2 border border-black bg-slate-200 font-light"
        type="text"
        value={formValues.address || ""}
        onChange={handleInputChange}
      />
    </div>
    {/* Image */}
    <div className="flex-1 min-w-[250px] space-y-1">
      <h3>*Image</h3>
      <input
        name="image"
        className="w-full px-2 py-2 border border-black bg-slate-200 font-light"
        type="file"
        onChange={handleFileChange}
      />
    </div>
  </div>

  <h1 className="text-black underline font-light">Company Information</h1>

  <div className="flex flex-wrap gap-6 pt-2">
    {/* Company Name */}
    <div className="flex-1 min-w-[250px] space-y-1">
      <h3>*Company Name</h3>
      <input
        name="companyName"
        className="w-full px-4 py-2 border border-black bg-slate-200 font-light"
        type="text"
        value={formValues.companyName || ""}
        onChange={handleInputChange}
      />
    </div>
    {/* Logo */}
    <div className="flex-1 min-w-[250px] space-y-1">
      <h3>*Logo</h3>
      <input
        name="logo"
        className="w-full px-2 py-2 border border-black bg-slate-200 font-light"
        type="file"
        onChange={handleFileChange}
      />
    </div>
    {/* Website */}
    <div className="flex-1 min-w-[250px] space-y-1">
      <h3>*Website</h3>
      <input
        name="website"
        className="w-full px-4 py-2 border border-black bg-slate-200 font-light"
        type="url"
        value={formValues.website || ""}
        onChange={handleInputChange}
      />
    </div>
  </div>

  <div className="flex flex-wrap gap-6 pt-2">
    {/* Location */}
    <div className="flex-1 min-w-[250px] space-y-1">
      <h3>*Location</h3>
      <input
        name="location"
        className="w-full px-4 py-2 border border-black bg-slate-200 font-light"
        type="text"
        value={formValues.location || ""}
        onChange={handleInputChange}
      />
    </div>
    {/* Description */}
    <div className="flex-[2] min-w-[300px] space-y-1">
      <h3>*Description</h3>
      <input
        name="description"
        className="w-full px-4 py-2 border border-black bg-slate-200 font-light"
        type="text"
        value={formValues.description || ""}
        onChange={handleInputChange}
      />
    </div>
  </div>

  <div className="flex justify-end pt-4">
    <button
      type="submit"
      className="px-8 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Apply
    </button>
  </div>
</form>
  );
}

RecruiterForm.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleFileChange:PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default RecruiterForm;
