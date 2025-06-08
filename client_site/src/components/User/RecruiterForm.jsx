
import PropTypes from 'prop-types';


function RecruiterForm({ formValues, handleInputChange,handleFileChange, handleSubmit }) {
  return (

    <form onSubmit={handleSubmit} className="text-black bg-white border h-[85vh] w-[185vh] mt-3">
      <h1 className="text-black underline font-light  ml-3 mt-1 ">Professional Information</h1>
      <div className="flex space-x-12 pl-16 pt-6">
        <div className="space-y-2">
          <h3 className="text-black">*First Name</h3>
          <input
            name="firstName"
            className="px-8 py-1 border border-black bg-slate-200 font-light"
            type="text"
            value={formValues.firstName || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-black">*Last Name</h3>
          <input
            name="lastName"
            className="px-8 py-1 border border-black bg-slate-200 font-light"
            type="text"
            value={formValues.lastName || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-black">*Phone Number</h3>
          <input
            name="phoneNumber"
            className="px-14 py-1 border border-black bg-slate-200 font-light"
            type="text"
            value={formValues.phoneNumber || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex space-x-12 pl-16 pt-2 shadow-sm pb-6">
        <div className="space-y-2">
          <h3 className="text-black">*Linkdin Profile</h3>
          <input
            name="profile"
            className="px-8 py-1 border border-black bg-slate-200 font-light"
            type="url"
            value={formValues.profile || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-black">*Address</h3>
          <input
            name="address"
            className="px-8 py-1 border border-black bg-slate-200 font-light"
            type="text"
            value={formValues.address || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-1">
          <h3 className="text-black">*Image</h3>
          <input
            name="image"
            className="-px-2 px-1 py-1 border border-black bg-slate-200 font-light"
            type="file"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <h1 className="text-black underline font-light ml-3 mt-1">Company Information</h1>

      <div className="flex space-x-12 pl-16 pt-2">
        <div className="space-y-2">
          <h3 className="text-black">*Company Name</h3>
          <input
            name="companyName"
            className="px-8 py-1 h-[7vh] border border-black bg-slate-200 font-light"
            type="text"
            value={formValues.companyName || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-black">*Logo</h3>
          <input
            name="logo"
            className=" -px-2 px-1 py-1 border border-black bg-slate-200 font-light"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <div className="  space-y-2">
          <h3 className="text-black">*Website</h3>
          <input
            name="website"
            className="px-8 py-1 h-[7vh] border border-black bg-slate-200 font-light"
            type="url"
            value={formValues.website || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex space-x-12 pl-16 pt-2">
        <div className="space-y-2">
          <h3 className="text-black ">*Location</h3>
          <input
            name="location"
            className="px-8 py-1 h-[7vh]  border border-black bg-slate-200 font-light"
            type="text"
            value={formValues.location || ""}
            onChange={handleInputChange}
          />  
        </div>
        <div className="  space-y-2">
          <h3 className="text-black">*Description</h3>
          <input
            name="description"
            className="w-[104vh] h-[8vh] px-8 border border-black bg-slate-200 font-light"
            type="text"
            value={formValues.description || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
      

      <div className="flex justify-end pr-20 mt-4 mr-4">
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
