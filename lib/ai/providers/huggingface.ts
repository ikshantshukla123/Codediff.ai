import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function classifyPRWithHuggingFace(diff: string) {
  try {
    const snippet = diff.substring(0, 1000) || "Update code"; 

    const response = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: snippet,
      parameters: {
        candidate_labels: [
          "Security Patch", 
          "Database Migration", 
          "Frontend UI", 
          "API Backend", 
          "Refactoring", 
          "Configuration"
        ]
      }
    });

    // 🔍 DEBUG: See exactly what HF gave us
    // console.log("HF Response:", JSON.stringify(response, null, 2));

    // 🛡️ FIX: Handle if response is an Array or an Object
    const result = Array.isArray(response) ? response[0] : response;

    // Now we are safe to access .labels
    if (!result || !result.labels || !Array.isArray(result.labels)) {
        return ["General Update"];
    }

    return result.labels.slice(0, 2); 
  } catch (error) {
    console.error("❌ Hugging Face Classification Failed:", error);
    return ["General Update"]; 
  }
}