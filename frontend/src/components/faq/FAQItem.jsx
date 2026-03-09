// components/faq/FAQItem.jsx
import React from "react";

export const FAQItem = ({ 
  question, 
  answer, 
  className = "",
  questionClassName = "text-xl font-bold text-gray-900 dark:text-white mb-3",
  answerClassName = "text-gray-600 dark:text-gray-300"
}) => {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg ${className}`}>
      <h3 className={questionClassName}>
        {question}
      </h3>
      <p className={answerClassName}>
        {answer}
      </p>
    </div>
  );
};

export default FAQItem;