import PropTypes from "prop-types";
import { useState } from "react";

function UserProfileForm({ formValues, handleInputChange, handleFileChange, handleSubmit }) {
  const [skills, setSkills] = useState(
    Array.isArray(formValues.skills) 
      ? formValues.skills 
      : typeof formValues.skills === "string" 
      ? formValues.skills.split(", ") 
      : []
  );
  const url = import.meta.env.VITE_BACKEND_URL;
  // Function to handle adding skills when space is pressed
  const handleSkillsInput = (e) => {
    const skill = e.target.value.trim();
    if (skill && !skills.includes(skill)) {
      const updatedSkills = [...skills, skill];
      setSkills(updatedSkills);
      handleInputChange({
        target: { name: "skills", value: updatedSkills.join(", ") }, // Store as comma-separated string
      });
      e.target.value = "";
    }
  };

  // Function to remove a skill
  const removeSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    handleInputChange({
      target: { name: "skills", value: updatedSkills.join(", ") }, // Update skills value
    });
  };


  return (
    <form onSubmit={handleSubmit} className="text-black bg-white border h-[80vh] w-[185vh] p-2  flex flex-col">
      <div className="flex items-start space-x-12">
        
        {/* Profile Image Section */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 mt-5 rounded-full overflow-hidden border border-gray-500 flex justify-center items-center">
            {formValues.image ? (
              typeof formValues.image === "string" ? (
                <img src={`${url}/${formValues.image}`} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <img src={URL.createObjectURL(formValues.image)} alt="Profile" className="w-full h-full object-cover rounded-full" />
              )
            ) : (
              <span className="text-gray-500">No Image</span>
            )}
          </div>
          {/* Image Upload Button */}
          <span className="mt-2 text-black font-medium">Profile Image</span>

          <input
            name="image"
            className="mt-2 px-2 py-1 border border-black bg-slate-200 font-light"
            type="file"
            onChange={handleFileChange}
          />
        </div>

        {/* User Information Section */}
        <div className="flex flex-col w-full">
          <div className="flex space-x-8">
            <div className="space-y-2">
              <h3 className="text-black font-semibold">Full Name</h3>
              <input
                name="fullName"
                className="px-6 py-2 border border-black bg-slate-200 rounded-md font-light w-full"
                type="text"
                value={formValues.fullName || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-black font-semibold">Email</h3>
              <input
                name="email"
                className="px-6 py-2 border border-black bg-slate-200 rounded-md font-light w-full"
                type="email"
                value={formValues.email || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-black font-semibold">Phone Number</h3>
              <input
                name="phoneNumber"
                className="px-6 py-2 border border-black bg-slate-200 rounded-md font-light w-full"
                type="text"
                value={formValues.phoneNumber || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <h3 className="text-black font-semibold">Bio</h3>
            <textarea
              name="bio"
              className="px-6 py-2 border border-black bg-slate-200 rounded-md font-light w-full h-24"
              value={formValues.bio || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Skills Section */}
          <div className="space-y-4">
            <h3 className="text-black font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-400 rounded-md bg-white">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 bg-blue-400 text-white rounded flex items-center space-x-2"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-white font-bold"
                  >
                    ❌
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-400 rounded-md bg-slate-100"
              placeholder="Type a skill and press space"
              onKeyPress={(e) => e.key === " " && handleSkillsInput(e)}
            />
          </div>

{/* Resume Upload Section */}
<div className="space-y-2">
  {/* Flex container to align the heading and link side by side */}
  <div className="flex items-center space-x-4">
    <h3 className="text-black font-semibold">Resume</h3>
    {formValues.resume && (
      <a
        href={typeof formValues.resume === "string"
          ? `${url}/${formValues.resume}`
          : URL.createObjectURL(formValues.resume)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        View Resume
      </a>
    )}
  </div>

  {/* Resume Input Field */}
  <input
    name="resume"
    className="px-6 py-2 border border-black bg-slate-200 rounded-md font-light w-full"
    type="file"
    onChange={handleFileChange}
    accept=".pdf,.doc,.docx"
  />
</div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button type="submit" className="px-8 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit Profile
        </button>
      </div>
    </form>
  );
}

UserProfileForm.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default UserProfileForm;