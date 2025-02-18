import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const askQuestion = async (vectorData, question, model) => {
  try {
    const response = await axios.post(API_URL, {
      vectorData,
      question,
      model
    });

    return response.data;
  } catch (error) {
    console.error("Error asking question:", error);
    throw new Error(error.response?.data?.message || "Failed to get answer");
  }
};
