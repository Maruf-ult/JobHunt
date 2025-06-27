import { Input } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

function CreateJobForm({ formValues, handleInputChange, handleSubmit }) {
  const [skills, setSkills] = useState([]);


  const handleSkillsInput = (e) => {
    const skill = e.target.value.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      handleInputChange({
        target: { name: "skills", value: [...skills, skill].join(", ") },
      });
      e.target.value = "";
    }
  };
  const removeSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    handleInputChange({
      target: { name: "skills", value: updatedSkills.join(", ") },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
     className="text-black bg-white h-auto w-full max-w-[185vh] border rounded-lg shadow-lg p-2 mx-auto space-y-2"
    >
      <h1 className="text-black text-lg font-semibold underline">
        Job Information
      </h1>


      <div className="grid grid-cols-3 gap-6 ">
        <div className="space-y-2">
          <label className="block text-black font-medium">*Position</label>
          <Input
            name="position"
            className="w-full p-2 border-gray-400 rounded-md bg-slate-100"
            type="text"
            value={formValues.position || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-black font-medium">*Job Type</label>
          <Input
            name="jobType"
            className="w-full p-2 border-gray-400 rounded-md bg-slate-100"
            type="text"
            value={formValues.jobType || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-black font-medium">*Experience</label>
          <Input
            name="experience"
            className="w-full p-2 border-gray-400 rounded-md bg-slate-100"
            type="text"
            value={formValues.experience || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-black font-medium">*Deadline</label>
          <Input
            name="deadline"
            className="w-full p-2 border-gray-400 rounded-md bg-slate-100"
            type="date"
            value={formValues.deadline || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-black font-medium">*Contact Email</label>
          <Input
            name="email"
            className="w-full p-2 border-gray-400 rounded-md bg-slate-100"
            type="email"
            value={formValues.email || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-black font-medium">*Salary</label>
          <Input
            name="salary"
            className="w-full p-2 border-gray-400 rounded-md bg-slate-100"
            type="number"
            value={formValues.salary || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

 
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-black font-medium">*Skills</label>
          <div className="flex flex-wrap gap-2 p-2 border border-gray-400 rounded-md bg-white">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-4  bg-blue-400 text-white rounded flex items-center space-x-2"
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
        <div className="space-y-2 " >
          <label className="block text-black font-medium pt-3">
            *Job Facilities
          </label>
          <Input
            name="facilities"
            className="w-full p-2 border-gray-400 rounded-md bg-slate-100"
            type="text"
            value={formValues.facilities || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2 ">
        <label className="block text-black font-medium ">*Job Description</label>
        <Input.TextArea
          name="description"
          className="w-full p-2 border-gray-400 rounded-md bg-slate-100 resize-none"
          value={formValues.description || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
        >
          Apply
        </button>
      </div>
    </form>
  );
}

CreateJobForm.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default CreateJobForm;
