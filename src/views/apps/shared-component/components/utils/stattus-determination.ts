import nlp from 'compromise';

export type StatusCategory = "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";

/**
 * Intelligently determines the category of a status string using NLP and pattern matching
 * Handles various formats: camelCase, snake_case, kebab-case, and capitalized words
 * 
 * @param status - The status string to analyze
 * @returns The appropriate status category
 */
export const getStatusCategory = (status: string): StatusCategory => {
  // Handle invalid inputs
  if (!status || typeof status !== "string") {
    console.error("Invalid status value:", status);
    return "default";
  }

  // Normalize the status string or handle boolean status
  let normalized;
  if (typeof status === 'string') {
    normalized = status
      .toLowerCase()
      .replace(/[_-]/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Handle camelCase
      .trim();
  } else if (typeof status === 'boolean') {
    normalized = status ? 'true' : 'false';
  } else {
    console.error("Invalid status type:", typeof status);
    return "default";
  }

  // Semantic analysis with compromise NLP
  try {
    const doc = nlp(normalized);

    // Sentiment analysis
    if (doc.has('(reject|false|cancel|fail|decline|denied|error|invalid|bad|wrong|issue|problem|fault)')) {
      return "error";
    }

    if (doc.has('(approve|true|confirm|complete|success|done|finished|accepted|valid|good|correct|resolved)')) {
      return "success";
    }

    if (doc.has('(pending|progress|process|wait|hold|evaluate|review|checking|verifying|validating)')) {
      return "warning";
    }

    if (doc.has('(initiate|new|start|begin|create|open|request|submitted)')) {
      return "info";
    }

    // Check for time-related terms
    if (doc.has('#Date') || doc.has('#Time') || doc.has('(schedule|planned|future|upcoming)')) {
      return "secondary";
    }

    // Check for active vs passive states
    if (doc.has('(active|current|ongoing|live)')) {
      return "primary";
    }

    if (doc.has('(inactive|archived|historical|past)')) {
      return "default";
    }

    // Additional sentiment analysis
    if (doc.has('#Negative')) {
      return "error";
    }

    if (doc.has('#Positive')) {
      return "success";
    }
  } catch (error) {
    console.log("Error processing NLP:", error);
  }

  // Context-based pattern matching as fallback
  const patterns = [
    { category: "error", regex: /fail|error|invalid|reject|denied|decline|cancel/ },
    { category: "success", regex: /success|complete|done|approved|confirmed|resolved|valid/ },
    { category: "warning", regex: /pending|progress|wait|hold|review|checking/ },
    { category: "info", regex: /new|start|begin|create|open|submitted/ },
    { category: "primary", regex: /active|current|ongoing|live/ },
    { category: "secondary", regex: /scheduled|planned|future/ },
    { category: "default", regex: /inactive|archived|historical/ }
  ];

  for (const pattern of patterns) {
    if (pattern.regex.test(normalized)) {
      return pattern.category as StatusCategory;
    }
  }

  // Default fallback
  return "default";
};
