export function formatAiResponse(rawText) {
  if (!rawText) {
    return {
      missingSkills: [],
      recommendedCourses: [],
      missingSkillsRawText: '',
      recommendedCoursesRawText: ''
    };
  }

  // Step 1: Trim everything before the first "Missing Skills:"
  const startIndex = rawText.indexOf('Missing Skills:');
  const trimmedText = startIndex >= 0 ? rawText.slice(startIndex) : rawText;

  // Step 2: Extract just the clean blocks (last match for each, in case duplicated)
  const allMissing = [...trimmedText.matchAll(/Missing Skills:\s*([\s\S]*?)(?=\nRecommended Courses:|$)/gi)];
  const allCourses = [...trimmedText.matchAll(/Recommended Courses:\s*([\s\S]*?)(?=\n[A-Z]|$)/gi)];

  const missingBlock = allMissing.at(-1)?.[1]?.trim() || '';
  const courseBlock = allCourses.at(-1)?.[1]?.trim() || '';

  const cleanSection = (block) =>
    block
      .split('\n')
      .map(line => line.trim())
      .filter(line =>
        line.length > 0 &&
        !/^[-*]?\s*(Skill|Course)?\s*\d*[:\-]?\s*$/i.test(line) &&
        !/^Missing Skills[:]?$/i.test(line) &&
        !/^Recommended Courses[:]?$/i.test(line)
      )
      .map(line => line.replace(/^[-*]?\s*(\d+\.\s*)?/, '').trim());

  const unique = (arr) => [...new Set(arr)];

  return {
    missingSkills: unique(cleanSection(missingBlock)),
    recommendedCourses: unique(cleanSection(courseBlock)),
    missingSkillsRawText: `Missing Skills:\n${missingBlock}`,
    recommendedCoursesRawText: `Recommended Courses:\n${courseBlock}`
  };
}
