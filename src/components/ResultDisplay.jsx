import React from 'react'

const ResultDisplay = ({
  missingSkills = [],
  recommendedCourses = []
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 bg-[#1e1e2a] p-6 rounded-lg mt-6 border border-[#872B97]">
      {/* Missing Skills */}
      <div>
        <h2 className="text-lg font-semibold text-[#72ff6a] mb-2">Missing Skills</h2>
        {missingSkills.length === 0 ? (
          <p className="text-gray-300 italic">No missing skills found.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1 text-[#f8f8f8]">
            {missingSkills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Recommended Courses */}
      <div>
        <h2 className="text-lg font-semibold text-[#FF7130] mb-2">Recommended Courses</h2>
        {recommendedCourses.length === 0 ? (
          <p className="text-gray-300 italic">No recommended courses found.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1 text-[#f8f8f8]">
            {recommendedCourses.map((course, idx) => (
              <li key={idx}>{course}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ResultDisplay
